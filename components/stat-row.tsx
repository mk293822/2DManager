// components/StatRow.tsx
import React from "react";
import { Text, View } from "react-native";

interface StatRowProps {
	label: string;
	value: string;
	highlight?: boolean;
	negative?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({
	label,
	value,
	highlight,
	negative,
}) => {
	return (
		<View className="flex-row justify-between items-center py-2 border-b border-gray-100">
			<Text className="text-gray-600">{label}</Text>
			<Text
				className={`${
					highlight ? "text-lg font-extrabold" : "text-base font-medium"
				} ${negative ? "text-red-500" : "text-gray-900"}`}
			>
				{value}
			</Text>
		</View>
	);
};

export default StatRow;
