import { EVENT_NAMES } from "@/event-names";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { two_d_api } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import { TwoDResponse } from "@/types/two-d-types";
import { useIsFocused } from "@react-navigation/native";
import { isAxiosError } from "axios";
import { useCallback, useRef, useState } from "react";

type Options = {
	interval?: number | false;
	immediate?: boolean;
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
	const { interval = 3000, immediate = true } = options;

	const [liveData, setLiveData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const isFocused = useIsFocused();

	const retryCount = useRef(0);
	const MAX_RETRY = 3;

	const fetchLive2D = useCallback(
		async (signal: AbortSignal, showLoading: boolean = true) => {
			if (!isFocused) return;

			if (retryCount.current === 0 && showLoading) setLoading(true);

			try {
				const { data } = await two_d_api.get<T>(url, { signal });

				setLiveData(data);

				// reset retry counter on success
				retryCount.current = 0;
			} catch (err) {
				if (signal.aborted) return;

				retryCount.current += 1;

				// only show error after 3 failures
				if (retryCount.current >= MAX_RETRY) {
					retryCount.current = 0;

					if (isAxiosError(err)) {
						eventBus.emit(EVENT_NAMES.NOTIFICATION, {
							title: "Error",
							description: err.message,
							type: "error",
						});
					} else {
						eventBus.emit(EVENT_NAMES.NOTIFICATION, {
							title: "Error",
							description: "Somethings went wrong!!",
							type: "error",
						});
					}
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
		fetchLive2D(controller.signal, false);
	}, [fetchLive2D]);

	return { liveData, loading, refetch };
}

export default useFetchLiveTwoD;
