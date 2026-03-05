import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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

import CommissionUserDetailsHeaderRight from "@/components/header-rights/commission-user-details";
import SectionSaleList from "@/components/section-sales/section-sale-list";
import useCommissionUserDetailsHook from "@/hooks/commission-user-details/use-commission-user-details-hook";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { usePhoneActions } from "@/hooks/use-phone-actions";
import AntDesign from "@expo/vector-icons/AntDesign";

const CommissionUserPage = () => {
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();
	const router = useRouter();
	const { call, message } = usePhoneActions();

	const userId = Array.isArray(id) ? id[0] : id;

	const {
		fetchCommissionUserDetails,
		commissionUserDetails,
		loading,
		error,
		reset,
		createComUserSection,
	} = useCommissionUserDetailsHook();

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
		<>
			<Stack.Screen
				options={{
					headerRight: () => <CommissionUserDetailsHeaderRight />,
				}}
			/>
			<PaperProvider>
				<ScrollView
					className="flex-1 bg-gray-100"
					contentContainerStyle={{
						paddingTop: 16,
						paddingBottom: 40,
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
						<View className="flex-row justify-between py-2">
							<Text className="text-gray-600">Manager</Text>
							<Text className="font-semibold">
								{commissionUserDetails.manager_name}
							</Text>
						</View>

						<View className="flex-row justify-between py-2">
							<Text className="text-gray-600">Phone Number</Text>
							<Text className="font-semibold">
								{commissionUserDetails.phone_number}
							</Text>
						</View>

						{/* ===== PHONE ACTIONS ===== */}
						<View className="mt-2">
							<View className="flex-row gap-3">
								{/* CALL BUTTON */}
								<TouchableOpacity
									activeOpacity={0.85}
									onPress={() => call(commissionUserDetails.phone_number)}
									className="flex-1 bg-blue-600 rounded-2xl py-3 flex-row items-center justify-center gap-2 shadow"
								>
									<AntDesign
										name="phone"
										size={18}
										color="white"
									/>
									<Text className="text-white font-bold text-base">Call</Text>
								</TouchableOpacity>

								{/* MESSAGE BUTTON */}
								<TouchableOpacity
									activeOpacity={0.85}
									onPress={
										() => message(commissionUserDetails.phone_number) // assuming you already created this
									}
									className="flex-1 bg-green-600 rounded-2xl py-3 flex-row items-center justify-center gap-2 shadow"
								>
									<AntDesign
										name="message"
										size={18}
										color="white"
									/>
									<Text className="text-white font-bold text-base">
										Message
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* ===== SECTION SALES ===== */}
					<SectionSaleList
						sales={commissionUserDetails.section_sales}
						createComUserSection={createComUserSection}
						userId={userId}
						userName={commissionUserDetails.name}
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
		</>
	);
};

export default CommissionUserPage;
