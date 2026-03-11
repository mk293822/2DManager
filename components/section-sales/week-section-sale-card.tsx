import { formatDateDisplay, formatKs } from "@/lib/helpers";
import { ComUserSectionSaleType } from "@/types/commission-user-types";
import React from "react";
import { Text, View } from "react-native";

const WeekSectionSaleCard = ({
	name,
	data,
	date,
}: {
	name: string;
	data: ComUserSectionSaleType | null;
	date: string;
}) => {
	if (!data) {
		return (
			<View className="bg-gray-100 rounded-xl p-3 mb-4">
				<Text className="text-gray-500 font-medium text-center">
					No {name} section for {formatDateDisplay(new Date(date))}
				</Text>
			</View>
		);
	}

	return (
		<View className="bg-gray-100 rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
			<Text className="font-semibold text-indigo-600 mb-2">{name} Section</Text>

			<View className="flex-row justify-between py-0.5">
				<Text className="text-gray-500">Commission Percent%</Text>
				<Text className="font-semibold text-indigo-700">
					{data.commission_percent} %
				</Text>
			</View>

			{[
				["Total Amount", data.total_amount],
				["Total Commission", data.total_commission],
				["Total Draw Value", data.total_draw_value],
				["Total Draw Amount", data.total_draw_amount],
			].map(([label, value]) => (
				<View
					key={label}
					className="flex-row justify-between py-0.5"
				>
					<Text className="text-gray-500">{label}</Text>
					<Text className="font-semibold">{formatKs(value as number)}</Text>
				</View>
			))}

			<View className="flex-row justify-between py-0.5">
				<Text className="text-gray-500">Include Draw Number</Text>
				<Text className="font-semibold text-indigo-700">
					{data.include_draw_number ? "Yes" : "No"}
				</Text>
			</View>

			<View className="flex-row justify-between py-0.5">
				<Text className="text-gray-500">Draw Number</Text>
				<Text className="font-semibold text-indigo-700">
					{data.section_summary.draw_number
						? data.section_summary.draw_number !== ""
							? data.section_summary.draw_number
							: "--"
						: "--"}
				</Text>
			</View>

			<View className="flex-row justify-between py-0.5">
				<Text className="text-gray-500">Draw Times</Text>
				<Text className="font-semibold text-red-700">
					&times; {data.section_summary.draw_times}
				</Text>
			</View>

			<View className="flex-row justify-between mt-1">
				<Text className="font-semibold">Profit / Loss</Text>
				<Text
					className={`font-bold ${
						data.profit_or_loss >= 0 ? "text-green-600" : "text-red-600"
					}`}
				>
					{formatKs(data.profit_or_loss)}
				</Text>
			</View>
		</View>
	);
};

export default WeekSectionSaleCard;
