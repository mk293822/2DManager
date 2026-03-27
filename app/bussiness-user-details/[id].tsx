// BussinessUserPage.tsx
import DeleteBussinessUserModal from "@/components/bussiness-user-details/delete-bussiness-user-modal";
import BussinessUserDetailsHeaderRight from "@/components/header-rights/bussiness-user-details";
import PageWrapper from "@/components/page-wrapper";
import SectionSaleList from "@/components/section-sales/section-sale-list";
import { EVENT_NAMES } from "@/event-names";
import useBussinessUserDetailsHook from "@/hooks/bussiness-user-details/use-bussiness-user-details-hook";
import useBussinessUserSectionsHook from "@/hooks/bussiness-user-details/use-bussiness-user-sections-hook";
import useBussinessUserHook from "@/hooks/bussiness-users/use-bussiness-user-hook";
import { usePhoneActions } from "@/hooks/use-phone-actions";
import { eventBus } from "@/lib/event-bus";
import { BussinessUserType } from "@/types/bussiness-user-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const BussinessUserPage = () => {
	const { id, bussinessUserType } = useLocalSearchParams<{
		id: string;
		bussinessUserType: BussinessUserType;
	}>();
	const router = useRouter();
	const { call, message } = usePhoneActions();
	const { deleteBussinessUser } = useBussinessUserHook(bussinessUserType);
	const [refreshing, setRefreshing] = useState(false);
	const [open, setOpen] = useState(false);

	const {
		bussinessUserDetails,
		editBussinessUserDetails,
		bussinessUserDetailsLoading,
		refetchBussinessUserDetails,
		bussinessDetailsError,
	} = useBussinessUserDetailsHook(id, bussinessUserType);

	const {
		todaySectionSales,
		sectionSaleLoading,
		secitonSalesError,
		refetchSectionSales,
		createBussinessUserSection,
		creatingSection,
		deleteBussinessUserSection,
		deletingSection,
		editBussinessUserSection,
		editingSection,
	} = useBussinessUserSectionsHook(
		id,
		{
			type: "day",
			date: new Date(),
		},
		bussinessUserType,
	);

	if (!id || !bussinessUserDetails || !bussinessUserType) {
		return;
	}

	const onRefresh = async () => {
		setRefreshing(true);
		refetchBussinessUserDetails();
		refetchSectionSales();
		setRefreshing(false);
	};

	const handleDeleteUser = async () => {
		const res = await deleteBussinessUser(id);

		if (res.error) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Error",
				description: res.error,
			});
		}
	};

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
							{bussinessUserDetails.name}
						</Text>
						<Text className="text-gray-500 mb-4">
							ID: {bussinessUserDetails.id}
						</Text>
						<View className="flex-row justify-between py-2">
							<Text className="text-gray-600">Manager</Text>
							<Text className="font-semibold">
								{bussinessUserDetails.manager_name}
							</Text>
						</View>
						<View className="flex-row justify-between py-2">
							<Text className="text-gray-600">Phone Number</Text>
							<Text className="font-semibold">
								{bussinessUserDetails.phone_number}
							</Text>
						</View>
						<View className="flex-row justify-between py-2">
							<Text className="text-gray-600">Default Commission %</Text>
							<Text className="font-semibold">
								{bussinessUserDetails.default_commission_percent}%
							</Text>
						</View>
						{bussinessUserDetails.user_type === "resold_user" && (
							<View className="flex-row justify-between py-2">
								<Text className="text-gray-600">Default Draw Times</Text>
								<Text className="font-semibold">
									{bussinessUserDetails.default_draw_times}%
								</Text>
							</View>
						)}
						<View className="mt-2 flex-row gap-3">
							<TouchableOpacity
								activeOpacity={0.85}
								onPress={() => call(bussinessUserDetails.phone_number)}
								className="flex-1 bg-blue-600 rounded-2xl py-3 flex-row items-center justify-center gap-2 shadow"
							>
								<Text className="text-white font-bold text-base">Call</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.85}
								onPress={() => message(bussinessUserDetails.phone_number)}
								className="flex-1 bg-green-600 rounded-2xl py-3 flex-row items-center justify-center gap-2 shadow"
							>
								<Text className="text-white font-bold text-base">Message</Text>
							</TouchableOpacity>
						</View>
					</View>
				);
			case "sectionSales":
				return (
					<SectionSaleList
						bussinessUserType={bussinessUserType}
						sales={todaySectionSales}
						userId={id}
						userName={bussinessUserDetails.name}
						createBussinessUserSection={createBussinessUserSection}
						creatingSection={creatingSection}
						editBussinessUserSection={editBussinessUserSection}
						editingSection={editingSection}
						deleteBussinessUserSection={deleteBussinessUserSection}
						deletingSection={deletingSection}
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
					headerRight: () =>
						bussinessUserDetails && (
							<BussinessUserDetailsHeaderRight
								default_commission_percent={
									bussinessUserDetails.default_commission_percent
								}
								bussinessUserType={bussinessUserType!}
								id={id}
								editBussinessUserDetails={editBussinessUserDetails}
								name={bussinessUserDetails.name}
								phone_number={bussinessUserDetails.phone_number}
							/>
						),
					headerLeft: ({ canGoBack, tintColor }) =>
						canGoBack ? (
							<TouchableOpacity
								onPress={() => router.back()}
								style={{ marginLeft: 5, marginRight: 15, marginBottom: 5 }}
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
							>
								<AntDesign
									name="arrow-left"
									size={20}
									color={tintColor}
								/>
							</TouchableOpacity>
						) : null,
					headerTitle: () => (
						<View
							style={{
								minHeight: 64,
								justifyContent: "center",
								paddingBottom: 6,
							}}
						>
							<Text
								style={{ color: "#e5e7eb", fontWeight: "600", fontSize: 20 }}
							>
								{bussinessUserType === "commission_user"
									? "Commission User"
									: "Resold User"}
							</Text>
						</View>
					),
				}}
			/>

			<PageWrapper
				loading={
					(bussinessUserDetailsLoading || sectionSaleLoading) && !refreshing
				}
				error={bussinessDetailsError || secitonSalesError}
				onReload={onRefresh}
				empty={!bussinessUserDetails || !todaySectionSales || !id}
				emptyMessage="No details found for this user."
			>
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
			</PageWrapper>

			<DeleteBussinessUserModal
				handleDelete={handleDeleteUser}
				open={open}
				onClose={() => setOpen(false)}
				user_name={bussinessUserDetails.name}
			/>
		</>
	);
};

export default BussinessUserPage;
