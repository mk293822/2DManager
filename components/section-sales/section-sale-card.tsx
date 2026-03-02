import { changeSectionName, formatKs, formatSmartNumber } from "@/lib/helpers";
import { ComUserSectionSaleType } from "@/types/commission-user-types";
import { SectionName } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const CommissionUserSectionCard = ({
	sale,
	createComUserSection,
	userId,
	date,
	section,
}: {
	sale: ComUserSectionSaleType;
	createComUserSection: (
		id: string,
		section: SectionName,
		date?: Date,
	) => Promise<void>;
	userId: string;
	date: Date;
	section: SectionName;
}) => {
	const section_summary = sale?.section_summary;
	const router = useRouter();

	const isProfit = sale?.profit_or_loss >= 0;

	if (!sale || !section_summary) {
		return (
			<View className="bg-white rounded-2xl shadow p-6 mb-6 items-center">
				<Text className="text-gray-400 font-extrabold text-xl mb-2">
					No Data for {changeSectionName(section)} Section!
				</Text>
				<Text className="text-gray-500 text-sm text-center mb-4">
					This session has no records yet.
				</Text>
				<TouchableOpacity
					activeOpacity={0.85}
					onPress={() => createComUserSection(userId, section, date)}
					className="bg-indigo-600 px-6 py-3 rounded-xl shadow"
				>
					<Text className="text-white font-bold">Create</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View className="bg-white rounded-2xl shadow p-6 mb-6">
			{/* Header */}
			<View className="flex-row justify-between items-center mb-2">
				<Text className="text-indigo-700 font-extrabold text-xl">
					{changeSectionName(section_summary.section)}
				</Text>
				<View className="flex-row items-center justify-end gap-3">
					<View
						style={{
							position: "relative",
						}}
					>
						<TouchableOpacity
							activeOpacity={0.85}
							hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
							className="p-2.5"
						>
							<AntDesign
								name="delete"
								color={"#b91c1c"}
								size={18}
							/>

							<View
								style={{
									position: "absolute",
									top: -0,
									bottom: -0,
									left: -0,
									right: -0,
									borderWidth: 1,
									borderColor: "#b91c1c",
									borderStyle: "dashed",
									borderRadius: 4,
								}}
								pointerEvents="none"
							/>
						</TouchableOpacity>
					</View>
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
					{section_summary.draw_number
						? section_summary.draw_number !== ""
							? section_summary.draw_number
							: "--"
						: "--"}
				</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Draw Times</Text>
				<Text className="font-extrabold text-red-700">
					&times; {section_summary.draw_times}
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

			<TouchableOpacity
				activeOpacity={0.85}
				className="bg-indigo-600 px-6 py-3 rounded-xl shadow mt-4"
				onPress={() =>
					router.push({
						pathname: "/user-two-d-list/[id]",
						params: { id: String(sale.id) },
					})
				}
			>
				<Text className="text-white font-bold text-center">
					Add Two-D Number
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default CommissionUserSectionCard;
