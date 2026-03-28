// file: components/PhoneNumberInput.tsx

import React from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
	label: string;
	value: string; // raw digits only
	onChange: (val: string) => void;
	error?: string;
};

const formatPhone = (digits: string) => {
	// Example: 0912345678 -> 09 123 456 78
	const cleaned = digits.replace(/\D/g, "");

	if (cleaned.length <= 2) return cleaned;
	if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
	if (cleaned.length <= 8)
		return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;

	return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 11)}`;
};

const PhoneNumberInput = ({ label, value, onChange, error }: Props) => {
	const displayValue = formatPhone(value);

	return (
		<View className="flex-col gap-1">
			<Text className="font-semibold text-gray-700">{label}</Text>

			<TextInput
				value={displayValue}
				onChangeText={(text) => {
					// keep only digits
					const digits = text.replace(/\D/g, "");
					onChange(digits);
				}}
				keyboardType="phone-pad"
				placeholder="09 123 456 789"
				className="border border-gray-300 rounded-lg px-3 py-2"
			/>

			{error && <Text className="text-red-500 text-sm">{error}</Text>}
		</View>
	);
};

export default PhoneNumberInput;
