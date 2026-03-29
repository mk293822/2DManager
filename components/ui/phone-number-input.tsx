// file: components/PhoneNumberInput.tsx

import { formatPhone } from "@/lib/helpers";
import React from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
	label: string;
	value: string; // raw digits only
	onChange: (val: string) => void;
	error?: string;
};

const PhoneNumberInput = ({ label, value, onChange, error }: Props) => {
	const displayValue = formatPhone(value);

	return (
		<View className="flex-col gap-1">
			<Text className="font-semibold text-gray-700">{label}</Text>

			<TextInput
				value={displayValue}
				onChangeText={(text) => {
					const digits = text.replace(/\D/g, "");
					onChange(digits);
				}}
				keyboardType="phone-pad"
				placeholder="09 123 456 789"
				placeholderTextColor={"#9ca3af"}
				textContentType="telephoneNumber"
				className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
			/>

			{error && <Text className="text-red-500 text-sm">{error}</Text>}
		</View>
	);
};

export default PhoneNumberInput;
