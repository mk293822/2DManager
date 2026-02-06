import { Text } from "react-native";

export function renderStyledValue(value: string | number) {
	const str = String(value);
	const [intPart, decimalPart = "00"] = str.split(".");

	// split integer part
	const normalPart = intPart.slice(0, -1);
	const highlightedDigit = intPart.slice(-1);

	return (
		<Text>
			<Text>{normalPart}</Text>
			<Text className="text-amber-500 underline font-semibold">
				{highlightedDigit}
			</Text>
			<Text>.{decimalPart}</Text>
		</Text>
	);
}
