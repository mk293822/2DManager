// components/ProfitBadge.tsx
import React from "react";
import { Text, View } from "react-native";

interface ProfitBadgeProps {
	value: number;
	format: (n: number) => string;
}

const ProfitBadge: React.FC<ProfitBadgeProps> = ({ value, format }) => {
	const positive = value >= 0;

	return (
		<View className="items-end">
			<Text className="text-gray-500 text-xs mb-1">Profit / Loss</Text>
			<Text
				className={`text-xl font-extrabold ${
					positive ? "text-green-500" : "text-red-500"
				}`}
			>
				{positive ? "+" : "-"} {format(Math.abs(value))}
			</Text>
		</View>
	);
};

export default ProfitBadge;
