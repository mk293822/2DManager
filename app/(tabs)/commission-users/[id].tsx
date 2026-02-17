import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import CommissionUserSectionsList from "@/components/commission-user/section-sale-list";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { useCommissionUserDataContext } from "@/hooks/use-commission-user-data-context";

const CommissionUserScreen = () => {
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();
	const router = useRouter();

	const userId = Array.isArray(id) ? id[0] : id;

	const { fetch_com_user_details, commissionUserDetails } =
		useCommissionUserDataContext();

	useAbortableEffect(
		(signal) => {
			if (!userId) {
				router.replace("/commission-users");
				return;
			}
			fetch_com_user_details(signal, userId);
		},
		[userId],
	);

	if (!commissionUserDetails) return null;

	return (
		<PaperProvider>
			<ScrollView
				className="flex-1 bg-gray-100"
				contentContainerStyle={{ paddingBottom: 120 }}
			>
				{/* ===== USER INFO CARD ===== */}
				<View className="bg-white rounded-2xl shadow p-6 m-4">
					<Text className="text-indigo-700 font-extrabold text-2xl mb-1">
						{commissionUserDetails.name}
					</Text>

					<Text className="text-gray-500 mb-4">
						ID: {commissionUserDetails.id}
					</Text>

					<View className="flex-row justify-between py-2 border-b border-gray-100">
						<Text className="text-gray-600">Phone</Text>
						<Text className="font-semibold">
							{commissionUserDetails.phone_number}
						</Text>
					</View>

					<View className="flex-row justify-between py-2">
						<Text className="text-gray-600">Manager</Text>
						<Text className="font-semibold">
							{commissionUserDetails.manager_name}
						</Text>
					</View>
				</View>

				{/* ===== SECTION SALES ===== */}
				<View className="px-4">
					<CommissionUserSectionsList
						sales={commissionUserDetails.section_sales}
					/>
				</View>
			</ScrollView>
		</PaperProvider>
	);
};

export default CommissionUserScreen;
