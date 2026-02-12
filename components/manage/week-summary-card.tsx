import { useManagePageContext } from "@/hooks/use-manage-page-context";
import { formatDateDisplay, formatKs, getTotalArray } from "@/lib/helpers";
import { SectionSummary } from "@/types/manage-types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
	summary: SectionSummary;
	date: Date;
};

const WeekSummaryCard = ({ summary, date }: Props) => {
	const { setRangeMode, setSelectedDate } = useManagePageContext();

	const handleToggle = () => {
		setSelectedDate(date);
		setRangeMode("day");
	};
	return (
		<>
			<View className="flex-row justify-between items-center mb-4 px-1">
				<Text className="text-indigo-600 font-bold text-xl">
					{formatDateDisplay(new Date(summary.date))}
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

				{getTotalArray(summary).map(([label, value]) => (
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

export default WeekSummaryCard;
