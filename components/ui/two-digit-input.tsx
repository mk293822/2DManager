// file: components/TwoDigitInput.tsx

import React from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
	label: string;
	value: string;
	onChange: (val: string) => void;
	error?: string;
};

const formatTwoDigit = (val: string) => {
	const num = Number(val || 0);
	return num.toString().padStart(2, "0").slice(0, 2);
};

const TwoDigitInput = ({ label, value, onChange, error }: Props) => {
	return (
		<View className="flex-col gap-1">
			<Text className="font-semibold text-gray-700">{label}</Text>

			<TextInput
				value={value ?? ""}
				onChangeText={(text) => {
					const clean = text.replace(/[^0-9]/g, "").slice(0, 2);
					onChange(clean);
				}}
				onBlur={() => {
					onChange(formatTwoDigit(value));
				}}
				className="border border-gray-300 rounded-lg px-3 py-2"
				keyboardType="numeric"
			/>

			{error && <Text className="text-red-500 text-sm">{error}</Text>}
		</View>
	);
};

export default TwoDigitInput;
