import { formatKs, getTotalArray } from "@/lib/helpers";
import { SectionSummaries } from "@/types/manage-types";
import React from "react";
import { Text, View } from "react-native";

const DaySummaryCard = ({
	summary,
	date,
}: {
	summary: SectionSummaries["summary"];
	date: string;
}) => (
	<View className="bg-white rounded-2xl shadow p-6 mb-6">
		<Text className="text-indigo-700 font-extrabold text-2xl mb-1">
			Summary
		</Text>
		<Text className="text-gray-500 mb-4">{date}</Text>

		{getTotalArray(summary).map(([label, value]) => (
			<View
				key={label}
				className="flex-row justify-between py-2 border-b border-gray-100"
			>
				<Text className="text-gray-600">{label}</Text>
				<Text className="font-semibold">{formatKs(value)}</Text>
			</View>
		))}

		<View className="flex-row justify-between pt-3">
			<Text className="font-semibold">Profit / Loss</Text>
			<Text
				className={`font-extrabold ${summary.profit_or_loss >= 0 ? "text-green-500" : "text-red-500"}`}
			>
				{formatKs(summary.profit_or_loss)}
			</Text>
		</View>
	</View>
);

export default DaySummaryCard;
