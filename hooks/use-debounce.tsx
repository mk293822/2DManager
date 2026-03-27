import { useEffect, useRef, useState } from "react";

/**
 * Debounces a value by the specified delay.
 * @param value The value to debounce
 * @param delay Delay in milliseconds
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			setDebouncedValue(value);
			return;
		}
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup on value or delay change
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
