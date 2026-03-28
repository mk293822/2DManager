// file: components/NumericInput.tsx

import React from "react";
import { Text, TextInput, View } from "react-native";

type NumericInputProps = {
	label: string;
	value: string | number;
	onChange: (val: string | number) => void;
	error?: string;
	min?: number;
	max?: number;
};

const NumericInput = ({
	label,
	value,
	onChange,
	error,
	min = 0,
	max,
}: NumericInputProps) => {
	return (
		<View className="flex-col gap-1">
			<Text className="font-semibold text-gray-700">{label}</Text>

			<TextInput
				value={value?.toString() ?? ""}
				onChangeText={(text) => {
					const clean = text.replace(/[^0-9]/g, "");
					onChange(clean === "" ? "" : Number(clean));
				}}
				onBlur={() => {
					let num = Number(value || 0);

					if (min !== undefined) num = Math.max(min, num);
					if (max !== undefined) num = Math.min(max, num);

					onChange(num);
				}}
				className="border border-gray-300 rounded-lg px-3 py-2"
				keyboardType="numeric"
			/>

			{error && <Text className="text-red-500 text-sm">{error}</Text>}
		</View>
	);
};

export default NumericInput;
