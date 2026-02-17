import { useCommissionUserDataContext } from "@/hooks/use-commission-user-data-context";
import { ComUserSectionSaleType } from "@/types/commission-user-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type filterModeType = "all" | "day" | "week";
const SectionSales = () => {
	const { commissionUserDetails } = useCommissionUserDataContext();
	const [filterMode, setFilterMode] = useState<filterModeType>("day");
	// const todaySecitons = commissionUserDetails?.section_sales.filter((sec) => sec.)

	if (!commissionUserDetails) return;

	return (
		<View>
			<View className="mx-4 mt-4 mb-2 flex-row justify-between items-center">
				<View className="flex-row gap-2">
					<TouchableOpacity
						onPress={() => setFilterMode("all")}
						className={`w-16 py-1 h-12 rounded-full items-center justify-center ${
							filterMode === "all" ? "bg-indigo-700" : "bg-indigo-900/60"
						}`}
					>
						<Text className="text-white text-center font-semibold text-sm">
							All
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setFilterMode("day")}
						className={`w-16 py-1 h-12 rounded-full items-center justify-center ${
							filterMode === "day" ? "bg-indigo-700" : "bg-indigo-900/60"
						}`}
					>
						<Text className="text-white text-center font-semibold text-sm">
							Day
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setFilterMode("week")}
						className={`w-16 py-1 h-12 rounded-full items-center justify-center ${
							filterMode === "week" ? "bg-indigo-700" : "bg-indigo-900/60"
						}`}
					>
						<Text className="text-white text-center font-semibold text-sm">
							Week
						</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity className="flex-row gap-1 bg-indigo-600 p-3 w-16 items-center justify-center rounded-full">
					<Text className="text-white text-center font-semibold text-sm">
						<AntDesign
							name="plus"
							size={18}
						/>
					</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				className="flex-1 bg-gray-100"
				contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
			>
				{commissionUserDetails.section_sales.length === 0 ? (
					<View className="bg-white rounded-2xl items-center justify-center p-8">
						<Text className="text-center text-gray-500 font-semibold">
							No section sales available.
						</Text>
					</View>
				) : (
					commissionUserDetails.section_sales.map(
						(sale: ComUserSectionSaleType) => (
							<View
								key={sale.id}
								className="bg-white rounded-2xl shadow p-4 mb-4 mx-4"
							>
								{/* <Text className="font-bold text-indigo-700 mb-2">
									Section: {sale.section_summary}
								</Text> */}

								<View className="flex-row justify-between py-1">
									<Text className="text-gray-600">Commission %</Text>
									<Text className="font-semibold">
										{sale.commission_percent}%
									</Text>
								</View>

								<View className="flex-row justify-between py-1">
									<Text className="text-gray-600">Total Amount</Text>
									<Text className="font-semibold">{sale.total_amount}</Text>
								</View>

								<View className="flex-row justify-between py-1">
									<Text className="text-gray-600">Total Commission</Text>
									<Text className="font-semibold">{sale.total_commission}</Text>
								</View>

								<View className="flex-row justify-between py-1">
									<Text className="text-gray-600">Include Draw Number</Text>
									<Text className="font-semibold">
										{sale.include_draw_number ? "Yes" : "No"}
									</Text>
								</View>

								<View className="flex-row justify-between py-1">
									<Text className="text-gray-600">Total Draw Amount</Text>
									<Text className="font-semibold">
										{sale.total_draw_amount}
									</Text>
								</View>
							</View>
						),
					)
				)}
			</ScrollView>
		</View>
	);
};

export default SectionSales;
