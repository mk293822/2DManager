import { formatDateDisplay, formatKs } from "@/lib/helpers";
import { ComUserSectionSaleSummary } from "@/types/bussiness-user-types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
	summary: ComUserSectionSaleSummary;
	date: Date;
	handleToggle: () => void;
};

const WeekSectionSaleSummaryCard = ({ summary, date, handleToggle }: Props) => {
	return (
		<>
			<View className="flex-row justify-between items-center mb-4 px-1">
				<Text className="text-indigo-600 font-bold text-xl">
					{formatDateDisplay(new Date(date))}
				</Text>
				<TouchableOpacity
					activeOpacity={0.85}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					onPress={handleToggle}
				>
					<Text className="text-indigo-600 underline font-semibold">
						Details
					</Text>
				</TouchableOpacity>
			</View>

			<View className="bg-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
				<Text className="font-semibold text-gray-700 mb-2">Summary</Text>

				{[
					["Total Amount", summary.total_amount],
					["Total Commission", summary.total_commission],
					["Total Draw Value", summary.total_draw_value],
					["Total Draw Amount", summary.total_draw_amount],
				].map(([label, value]) => (
					<View
						key={label}
						className="flex-row justify-between py-1"
					>
						<Text className="text-gray-500">{label}</Text>
						<Text className="font-semibold">{formatKs(value as number)}</Text>
					</View>
				))}

				<View className="flex-row justify-between mt-2">
					<Text className="font-semibold">Profit / Loss</Text>
					<Text
						className={`font-bold ${
							summary.profit_or_loss >= 0 ? "text-green-600" : "text-red-600"
						}`}
					>
						{formatKs(summary.profit_or_loss)}
					</Text>
				</View>
			</View>
		</>
	);
};

export default WeekSectionSaleSummaryCard;
