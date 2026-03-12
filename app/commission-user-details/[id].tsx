// CommissionUserPage.tsx
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	Pressable,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	ActivityIndicator,
	Provider as PaperProvider,
} from "react-native-paper";

import DeleteComUserModal from "@/components/commission-user-details/delete-com-user-modal";
import CommissionUserDetailsHeaderRight from "@/components/header-rights/commission-user-details";
import SectionSaleList from "@/components/section-sales/section-sale-list";
import { useCommissionUserDetailsContext } from "@/hooks/commission-user-details/use-context";
import { useCommissionUserContext } from "@/hooks/commission-users/use-commission-user-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { usePhoneActions } from "@/hooks/use-phone-actions";

const CommissionUserPage = () => {
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();
	const router = useRouter();
	const { call, message } = usePhoneActions();
	const { deleteCommissionUser } = useCommissionUserContext();
	const [open, setOpen] = useState(false);

	const userId = Array.isArray(id) ? id[0] : id;

	const {
		fetchCommissionUserDetails,
		commissionUserDetails,
		loading,
		error,
		reset,
		createComUserSection,
		editCommissionUserDetails,
		deleteComUserSection,
	} = useCommissionUserDetailsContext();

	const [refreshing, setRefreshing] = useState(false);

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

	const onRefresh = async () => {
		if (!userId) return;
		setRefreshing(true);
		await reset(userId);
		setRefreshing(false);
	};

	const handleDeleteUser = async () => {
		if (!userId) return;
		await deleteCommissionUser(userId);
		setOpen(false);
		router.replace("/(tabs)/commission-users");
	};

	if (!userId) {
		router.replace("/commission-users");
		return null;
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
					onPress={onRefresh}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}

	if (!commissionUserDetails) return null;

	// Flatten all sections into a list
	const flatListData = [
		{ type: "userCard" },
		{ type: "sectionSales" },
		{ type: "dangerZone" },
	];

	const renderItem = ({ item }: { item: (typeof flatListData)[0] }) => {
		switch (item.type) {
			case "userCard":
				return (
					<View className="bg-white rounded-2xl shadow p-6 mb-4">
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
						<View className="flex-row justify-between py-2">
							<Text className="text-gray-600">Default Commission %</Text>
							<Text className="font-semibold">
								{commissionUserDetails.default_commission_percent}%
							</Text>
						</View>
						<View className="mt-2 flex-row gap-3">
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
							<TouchableOpacity
								activeOpacity={0.85}
								onPress={() => message(commissionUserDetails.phone_number)}
								className="flex-1 bg-green-600 rounded-2xl py-3 flex-row items-center justify-center gap-2 shadow"
							>
								<AntDesign
									name="message"
									size={18}
									color="white"
								/>
								<Text className="text-white font-bold text-base">Message</Text>
							</TouchableOpacity>
						</View>
					</View>
				);
			case "sectionSales":
				return (
					<SectionSaleList
						deleteComUserSection={deleteComUserSection}
						sales={commissionUserDetails.section_sales}
						createComUserSection={createComUserSection}
						userId={userId}
						user_name={commissionUserDetails.name}
					/>
				);
			case "dangerZone":
				return (
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
							onPress={() => setOpen(true)}
							className="bg-red-600 rounded-xl py-3 items-center"
						>
							<Text className="text-white font-extrabold text-base">
								Delete User
							</Text>
						</TouchableOpacity>
					</View>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<CommissionUserDetailsHeaderRight
							default_commission_percent={
								commissionUserDetails.default_commission_percent
							}
							id={userId}
							editCommissionUserDetails={editCommissionUserDetails}
							name={commissionUserDetails.name}
							phone_number={commissionUserDetails.phone_number}
						/>
					),
				}}
			/>
			<PaperProvider>
				<FlatList
					data={flatListData}
					renderItem={renderItem}
					keyExtractor={(item, index) => item.type + index}
					refreshControl={
						<RefreshControl
							colors={["#0000ff"]}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					contentContainerStyle={{
						paddingTop: 16,
						paddingBottom: 40,
						paddingHorizontal: 16,
						gap: 16,
					}}
				/>
			</PaperProvider>

			<DeleteComUserModal
				handleDelete={handleDeleteUser}
				open={open}
				onClose={() => setOpen(false)}
				user_name={commissionUserDetails.name}
			/>
		</>
	);
};

export default CommissionUserPage;
