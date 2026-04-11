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

const DEFAULT_TTL = process.env.EXPO_PUBLIC_DEFAULT_CACHE_TTL ?? 86400000;

// -------------------------
// CACHE TYPES
// -------------------------
type CacheItem<T = any> = {
	data: T;
	timestamp: number;
	ttl: number;
};

// -------------------------
// GLOBAL CACHE + LISTENERS
// -------------------------
const cache: Record<string, CacheItem> = {};
const pending: Record<string, Promise<any>> = {};
const listeners: Record<string, Set<(data: any) => void>> = {};

// -------------------------
// HELPERS
// -------------------------
const isExpired = (item: CacheItem) => {
	return Date.now() - item.timestamp > item.ttl;
};

// -------------------------
// Notify all listeners
// -------------------------
function notify<T>(key: string, value: T) {
	queueMicrotask(() => {
		if (listeners[key]) {
			for (const cb of listeners[key]) cb(value);
		}
	});
}

// -------------------------
// Get Cache (SAFE)
// -------------------------
export function getCache<T>(
	key: string,
	isConnected: boolean | null,
): T | null {
	const item = cache[key];

	if (!item) return null;

	if (isExpired(item) && isConnected) {
		delete cache[key];
		return null;
	}

	return item.data as T;
}

// -------------------------
// Update Cache
// -------------------------
export function updateCache<T>(
	key: string,
	updater: (prev: T | undefined) => T,
) {
	const prevItem = cache[key];
	const prev = prevItem?.data;

	const next = updater(prev);

	cache[key] = {
		data: next,
		timestamp: Date.now(),
		ttl: prevItem?.ttl ?? DEFAULT_TTL,
	};

	notify(key, next);
}

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
	const isConnected = useInternet();
	const [data, setData] = useState<T | null>(() =>
		getCache<T>(key, isConnected),
	);
	const [isLoading, setIsLoading] = useState(!getCache(key, isConnected));
	const [error, setError] = useState<Error | null>(null);

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

		const cached = getCache<T>(key, isConnected);
		if (cached) {
			setData(cached);
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

				cache[key] = {
					data: result,
					timestamp: Date.now(),
					ttl: DEFAULT_TTL,
				};

				delete pending[key];

				notify(key, result);

				if (isMounted.current) setData(result);
			} catch (e: unknown) {
				delete pending[key];
				if (isMounted.current) {
					setError(new Error(getErrorMessage(e)));
				}
			} finally {
				if (isMounted.current) setIsLoading(false);
			}
		};

		fetchData();

		return () => {
			isMounted.current = false;
		};
	}, [key, fetcher, isAuthenticated, authLoading, isConnected]);

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
		}

		setError(null);

		delete cache[key];
		delete pending[key];

		try {
			const result = await fetcher();

			cache[key] = {
				data: result,
				timestamp: Date.now(),
				ttl: DEFAULT_TTL,
			};

			notify(key, result);

			setData(result);
		} catch (e: unknown) {
			setError(new Error(getErrorMessage(e)));
		} finally {
			setIsLoading(false);
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

			cache[key] = {
				data: value,
				timestamp: Date.now(),
				ttl: DEFAULT_TTL,
			};

			notify(key, value);

			return value;
		});
	};

	return { data, isLoading, error, refetch, setData: setDataSafe };
}
