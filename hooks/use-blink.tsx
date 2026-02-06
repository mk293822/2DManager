import { useEffect, useState } from "react";

export function useBlink(isResult: boolean = true) {
	const [visible, setVisible] = useState(true);
	const style = { opacity: visible ? 1 : 0 };

	useEffect(() => {
		let blinkInterval: number | undefined;

		const updateBlink = () => {
			if (!isResult && !blinkInterval) {
				// Start blinking
				blinkInterval = setInterval(() => {
					setVisible(false);
					setTimeout(() => setVisible(true), 1000); // blink duration
				}, 3000);
			} else if (isResult && blinkInterval) {
				// Stop blinking
				clearInterval(blinkInterval);
				blinkInterval = undefined;
				setVisible(true); // make sure text is visible outside periods
			}
		};

		const timer = setInterval(updateBlink, 2000); // check every second
		updateBlink(); // immediate check on mount

		return () => {
			clearInterval(timer);
			if (blinkInterval) clearInterval(blinkInterval);
		};
	}, [isResult]);

	return { visible, style };
}
