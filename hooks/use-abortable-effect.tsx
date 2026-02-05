import { useEffect } from "react";

export const useAbortableEffect = (
	effect: (signal: AbortSignal) => void | (() => void),
	deps: React.DependencyList,
) => {
	useEffect(() => {
		const controller = new AbortController();

		const cleanup = effect(controller.signal);

		return () => {
			controller.abort();
			if (typeof cleanup === "function") {
				cleanup();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
};
