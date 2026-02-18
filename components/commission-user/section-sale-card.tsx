import { changeSectionName, formatKs, formatSmartNumber } from "@/lib/helpers";
import { ComUserSectionSaleType } from "@/types/commission-user-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const CommissionUserSectionCard = ({
	sale,
}: {
	sale: ComUserSectionSaleType;
}) => {
	if (!sale || !sale?.section_summary) return null;

	const section = sale.section_summary;

	const isProfit = sale.profit_or_loss >= 0;

	return (
		<View className="bg-white rounded-2xl shadow p-6 mb-6">
			{/* Header */}
			<View className="flex-row justify-between items-center mb-2">
				<Text className="text-indigo-700 font-extrabold text-xl">
					{changeSectionName(section.section)}
				</Text>
				<View className="flex-row items-center justify-end gap-3">
					<TouchableOpacity
						activeOpacity={0.85}
						className="p-2.5"
					>
						<AntDesign
							name="edit"
							size={18}
							color="#4338ca"
						/>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.85}
						className="p-2.5"
					>
						<AntDesign
							name="delete"
							size={18}
							color="#b91c1c"
						/>
					</TouchableOpacity>
				</View>
			</View>

			{/* Section Details */}
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Commission %</Text>
				<Text className="font-semibold">
					{formatSmartNumber(sale.commission_percent)}%
				</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Total Amount</Text>
				<Text className="font-semibold">{formatKs(sale.total_amount)}</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Total Commission</Text>
				<Text className="font-semibold">{formatKs(sale.total_commission)}</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Include Draw Number</Text>
				<Text className="font-semibold">
					{sale.include_draw_number ? "Yes" : "No"}
				</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Total Draw Amount</Text>
				<Text className="font-semibold">
					{formatKs(sale.total_draw_amount)}
				</Text>
			</View>

			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Draw Number</Text>
				<Text className="font-extrabold text-indigo-700">
					{section.draw_number ?? "--"}
				</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Draw Times</Text>
				<Text className="font-extrabold text-red-700">
					&times; {section.draw_times}
				</Text>
			</View>

			<View className="flex-row justify-between pt-3">
				<Text className="font-semibold">Profit / Loss</Text>
				<Text
					className={`font-extrabold ${
						isProfit ? "text-green-500" : "text-red-500"
					}`}
				>
					{formatKs(sale.profit_or_loss)}
				</Text>
			</View>
		</View>
	);
};

export default CommissionUserSectionCard;
