// hooks/useCache.ts
import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "./auth/use-auth-context";
import { useInternet } from "./use-internet";

type UseCacheTypes<T> = {
	data: T | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	setData: (newData: T | ((prev: T | null) => T)) => void;
};

// -------------------------
// GLOBAL CACHE + LISTENERS
// -------------------------
const cache: Record<string, any> = {};
const pending: Record<string, Promise<any>> = {};
const listeners: Record<string, Set<(data: any) => void>> = {};

// -------------------------
// Update Cache
// -------------------------
export function updateCache<T>(
	key: string,
	updater: (prev: T | undefined) => T,
) {
	const prev = cache[key];
	const next = updater(prev);

	// update cache
	cache[key] = next;

	notify(key, next);
}

// ------------------------
// Notify all listeners
// ------------------------
function notify<T>(key: string, value: T) {
	queueMicrotask(() => {
		if (listeners[key]) {
			for (const cb of listeners[key]) cb(value);
		}
	});
}

// -------------------------
// Get Cache
// -------------------------
export function getCache<T>(key: string): T | null {
	return cache[key] as T | null;
}

// -------------------------
// Clear All the Cache and Pending Requests
// -------------------------
export const clearAllCache = () => {
	Object.keys(cache).forEach((k) => delete cache[k]);
	Object.keys(pending).forEach((k) => delete pending[k]);
};
// -------------------------
// ERROR NORMALIZER
// -------------------------
export function getErrorMessage(
	err: unknown,
	fallback = "Something went wrong",
): string {
	if (isAxiosError(err)) {
		return (
			err.response?.data?.message ||
			err.response?.data?.detail ||
			err.message ||
			fallback
		);
	}

	if (err instanceof Error) return err.message;

	return fallback;
}

// -------------------------
// HOOK
// -------------------------
export function useCache<T>(
	key: string,
	fetcher: () => Promise<T>,
): UseCacheTypes<T> {
	const [data, setData] = useState<T | null>(cache[key] || null);
	const [isLoading, setIsLoading] = useState(!cache[key]);
	const [error, setError] = useState<Error | null>(null);
	const isConnected = useInternet();
	const { authLoading, isAuthenticated } = useAuthContext();
	const isMounted = useRef(true);

	// -------------------------
	// SUBSCRIBE TO GLOBAL UPDATES
	// -------------------------
	useEffect(() => {
		isMounted.current = true;

		if (!listeners[key]) listeners[key] = new Set();

		const callback = (newData: T) => {
			if (isMounted.current) setData(newData);
		};

		listeners[key].add(callback);

		return () => {
			isMounted.current = false;
			listeners[key].delete(callback);
		};
	}, [key]);

	// -------------------------
	// INITIAL FETCH
	// -------------------------
	useEffect(() => {
		isMounted.current = true;
		if (authLoading || !isAuthenticated) return;
		if (cache[key]) {
			setData(cache[key]);
			setIsLoading(false);
			setError(null);
			return;
		}

		const fetchData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				if (!pending[key]) pending[key] = fetcher();

				const result = await pending[key];

				cache[key] = result;
				delete pending[key];

				// Notify all subscribers
				notify(key, result);

				if (isMounted.current) setData(result);
			} catch (e: unknown) {
				delete pending[key];
				if (isMounted.current) setError(new Error(getErrorMessage(e)));
			} finally {
				if (isMounted.current) setIsLoading(false);
			}
		};

		fetchData();

		return () => {
			isMounted.current = false;
		};
	}, [key, fetcher, isAuthenticated, authLoading]);

	// -------------------------
	// REFETCH
	// -------------------------
	const refetch = async () => {
		setIsLoading(true);
		if (!isConnected) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Network Error",
				description: "Check your connection and retry!",
			});
			setIsLoading(false);
			return;
		} else {
			setError(null);

			delete cache[key];
			delete pending[key];

			try {
				const result = await fetcher();
				cache[key] = result;

				// Notify all subscribers
				notify(key, result);

				setData(result);
			} catch (e: unknown) {
				setError(new Error(getErrorMessage(e)));
			} finally {
				setIsLoading(false);
			}
		}
	};

	// -------------------------
	// SAFE SET DATA
	// -------------------------
	const setDataSafe = (newData: T | ((prev: T | null) => T)) => {
		setData((prev) => {
			const value =
				typeof newData === "function"
					? (newData as (prev: T | null) => T)(prev)
					: newData;

			cache[key] = value;

			// Notify all subscribers
			notify(key, value);

			return value;
		});
	};

	return { data, isLoading, error, refetch, setData: setDataSafe };
}
