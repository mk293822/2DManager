import { formatDateDisplay, formatKs } from "@/lib/helpers";
import { ComUserSectionSaleSummary } from "@/types/commission-user-types";
import React from "react";
import { Text, View } from "react-native";

const SectionSummaryCard = ({
	summary,
	date,
}: {
	summary: ComUserSectionSaleSummary;
	date: Date;
}) => (
	<View className="bg-white rounded-2xl shadow p-6 mb-6">
		<Text className="text-indigo-700 font-extrabold text-2xl mb-1">
			Summary
		</Text>
		<Text className="text-gray-500 mb-4">{formatDateDisplay(date)}</Text>

		<View className="flex-row justify-between py-2 border-b border-gray-100">
			<Text className="text-gray-600">Total Sold</Text>
			<Text className="font-semibold">{formatKs(summary.total_amount)}</Text>
		</View>
		<View className="flex-row justify-between py-2 border-b border-gray-100">
			<Text className="text-gray-600">Total Commission</Text>
			<Text className="font-semibold">
				{formatKs(summary.total_commission)}
			</Text>
		</View>
		<View className="flex-row justify-between py-2 border-b border-gray-100">
			<Text className="text-gray-600">Total Draw Amount</Text>
			<Text className="font-semibold">
				{formatKs(summary.total_draw_value)}
			</Text>
		</View>

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

export default SectionSummaryCard;
