import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	ActivityIndicator,
	Provider as PaperProvider,
} from "react-native-paper";

import CommissionUserSectionsList from "@/components/commission-user/section-sale-list";
import { useCommissionUserDetailsContext } from "@/hooks/commission-user-details/use-details-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";

const CommissionUserScreen = () => {
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();
	const router = useRouter();

	const userId = Array.isArray(id) ? id[0] : id;

	const {
		fetchCommissionUserDetails,
		commissionUserDetails,
		loading,
		error,
		reset,
		createComUserSection,
	} = useCommissionUserDetailsContext();

	useAbortableEffect(
		(signal) => {
			if (!userId) {
				router.replace("/commission-users");
				return;
			}
			fetchCommissionUserDetails(signal, userId);
		},
		[userId],
	);

	if (!userId) {
		router.replace("/commission-users");
		return;
	}

	if (loading)
		return (
			<View className="flex-1 items-center justify-center bg-gray-100">
				<ActivityIndicator
					size={50}
					color="#2563eb"
				/>
			</View>
		);

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4">
				<Text className="text-red-600 font-semibold text-center mb-4">
					{error}
				</Text>
				<Pressable
					onPress={() => reset(userId)}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}

	if (!commissionUserDetails) return null;

	return (
		<PaperProvider>
			<ScrollView
				className="flex-1 bg-gray-100"
				contentContainerStyle={{
					paddingTop: 16,
					paddingBottom: 120,
					paddingHorizontal: 16,
					gap: 16,
				}}
			>
				{/* ===== USER INFO CARD ===== */}
				<View className="bg-white rounded-2xl shadow p-6">
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
				<CommissionUserSectionsList
					sales={commissionUserDetails.section_sales}
					createComUserSection={createComUserSection}
					userId={userId}
				/>
				<View className="bg-red-100 border border-red-400 rounded-2xl p-6">
					<Text className="text-red-600 font-extrabold text-lg mb-2">
						Danger Zone
					</Text>

					<Text className="text-gray-500 mb-4">
						Deleting this user will permanently remove all related data and
						commissions.
					</Text>

					<TouchableOpacity
						activeOpacity={0.85}
						className="bg-red-600 rounded-xl py-3 items-center"
					>
						<Text className="text-white font-extrabold text-base">
							Delete User
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</PaperProvider>
	);
};

export default CommissionUserScreen;
