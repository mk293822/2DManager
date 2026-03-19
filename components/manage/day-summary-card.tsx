import { formatDateDisplay, formatKs, getTotalArray } from "@/lib/helpers";
import { SectionSummary } from "@/types/manage-types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const DaySummaryCard = ({
	summary,
	date,
	handleToggle,
	showDetailsBtn = false,
}: {
	summary: SectionSummary;
	date: string;
	handleToggle?: () => void;
	showDetailsBtn?: boolean;
}) => (
	<View className="bg-white rounded-2xl shadow p-6 mb-6">
		<View className="flex-row justify-between items-center mb-2">
			{showDetailsBtn ? (
				<View className="flex-row">
					<Text className="text-gray-700 font-semibold text-lg">
						{formatDateDisplay(new Date(date))}
					</Text>
				</View>
			) : (
				<View>
					<Text className="text-indigo-700 font-extrabold text-2xl">
						Summary
					</Text>
					<Text className="text-gray-500">{date}</Text>
				</View>
			)}
			{showDetailsBtn && (
				<TouchableOpacity
					onPress={handleToggle}
					activeOpacity={0.85}
					className="px-4 py-2 rounded-full flex-row items-center justify-center"
					style={{
						backgroundColor: "transparent",
						borderColor: "#4f46e5", // Indigo-600
						borderWidth: 1,
						marginRight: -2,
					}}
				>
					<Text className="text-indigo-600 font-semibold text-sm">Details</Text>
				</TouchableOpacity>
			)}
		</View>
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
