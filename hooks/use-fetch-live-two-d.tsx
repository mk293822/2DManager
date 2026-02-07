import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { api } from "@/lib/api";
import { TwoDResponse } from "@/types/two-d-types";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useState } from "react";

type Options = {
	interval?: number | false; // ms | disable
	immediate?: boolean; // fetch on focus
};

type UseFetchLiveTwoD<T> = {
	liveData: T | null;
	loading: boolean;
	refetch: () => void;
};

function useFetchLiveTwoD<T = TwoDResponse>(
	url: string = "/live",
	options: Options = {},
): UseFetchLiveTwoD<T> {
	const {
		interval = 3000, // default polling
		immediate = true,
	} = options;

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
				if (!signal.aborted) {
					console.error(err);
				}
			} finally {
				setLoading(false);
			}
		},
		[url, isFocused],
	);

	useAbortableEffect(
		(signal) => {
			if (!isFocused) return;

			if (immediate) {
				fetchLive2D(signal);
			}

			if (interval === false) return;

			const id = setInterval(() => fetchLive2D(signal), interval);

			return () => clearInterval(id);
		},
		[fetchLive2D, isFocused, interval, immediate],
	);

	const refetch = useCallback(() => {
		const controller = new AbortController();
		fetchLive2D(controller.signal);
	}, [fetchLive2D]);

	return { liveData, loading, refetch };
}

export default useFetchLiveTwoD;
