import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { api } from "@/lib/api";
import { TwoDResponse } from "@/types";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useState } from "react";

type UseFetchLiveTwoD<T> = {
	liveData: T | null;
	loading: boolean;
	refetch: () => void;
};

function useFetchLiveTwoD<T = TwoDResponse>(
	url: string = "/live",
): UseFetchLiveTwoD<T> {
	const [liveData, setLiveData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const isFocused = useIsFocused();

	const fetchLive2D = useCallback(
		async (signal: AbortSignal) => {
			if (!isFocused) return;
			setLoading(true);
			try {
				const { data } = await api.get<T>(url, { signal });
				setLiveData(data);
			} catch (err) {
				if (signal.aborted) return;
				console.error(err);
			} finally {
				setLoading(false);
			}
		},
		[url, isFocused],
	);

	// 🔁 auto-fetch on every blink visible
	useAbortableEffect(
		(signal) => {
			if (!isFocused) return;

			fetchLive2D(signal); // immediate fetch
			const id = setInterval(() => fetchLive2D(signal), 1000);

			return () => clearInterval(id); // cleanup
		},
		[fetchLive2D, isFocused],
	);

	// 🖱 manual fetch
	const refetch = useCallback(() => {
		const controller = new AbortController();
		fetchLive2D(controller.signal);
	}, [fetchLive2D]);

	return { liveData, loading, refetch };
}

export default useFetchLiveTwoD;
