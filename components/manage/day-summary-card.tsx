import { formatKs, getTotalArray } from "@/lib/helpers";
import { SectionSummaries } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const DaySummaryCard = ({
	summary,
	date,
	handleToggle,
	showDetailsBtn,
}: {
	summary: SectionSummaries["summary"];
	date: string;
	handleToggle?: () => void;
	showDetailsBtn?: boolean;
}) => (
	<View className="bg-white rounded-2xl shadow p-6 mb-6">
		<View className="flex-row justify-between items-center mb-1">
			<View>
				<Text className="text-indigo-700 font-extrabold text-2xl">Summary</Text>
				<Text className="text-gray-500">{date}</Text>
			</View>
			{showDetailsBtn && (
				<TouchableOpacity
					onPress={handleToggle}
					activeOpacity={0.85}
					className="mb-3 pl-5 pr-3 py-2 rounded-full flex-row items-center justify-center"
					style={{
						backgroundColor: "#4f46e5", // Indigo-600
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						shadowRadius: 5,
						elevation: 6,
					}}
				>
					<Text className="text-white font-semibold text-sm mr-1">Details</Text>
					<AntDesign
						name="right"
						size={14}
						color="white"
					/>
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
