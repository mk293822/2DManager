// BussinessUserPage.tsx
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
import { Provider as PaperProvider } from "react-native-paper";

import DeleteBussinessUserModal from "@/components/bussiness-user-details/delete-bussiness-user-modal";
import BussinessUserDetailsHeaderRight from "@/components/header-rights/bussiness-user-details";
import { Loading } from "@/components/loading";
import SectionSaleList from "@/components/section-sales/section-sale-list";
import { useBussinessUserDetailsContext } from "@/hooks/bussiness-user-details/use-context";
import { useBussinessUserContext } from "@/hooks/bussiness-users/use-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { usePhoneActions } from "@/hooks/use-phone-actions";

const BussinessUserPage = () => {
	const { id } = useLocalSearchParams<{
		id?: string;
	}>();
	const router = useRouter();
	const { call, message } = usePhoneActions();
	const { deleteBussinessUser } = useBussinessUserContext();
	const [refreshing, setRefreshing] = useState(false);
	const [open, setOpen] = useState(false);

	const {
		fetchBussinessUserDetails,
		bussinessUserDetails,
		loading,
		error,
		createBussinessUserSection,
		editBussinessUserDetails,
		deleteBussinessUserSection,
		bussinessUserType,
	} = useBussinessUserDetailsContext();

	useAbortableEffect(
		(signal) => {
			if (!id) {
				router.back();
				return;
			}
			fetchBussinessUserDetails(signal, id);
		},
		[id],
	);

	const onRefresh = async () => {
		if (!id) return;
		const controller = new AbortController();

		setRefreshing(true);
		await fetchBussinessUserDetails(controller.signal, id, false);
		setRefreshing(false);
	};

	const handleDeleteUser = async () => {
		if (!id || !bussinessUserType) return;
		await deleteBussinessUser(id, bussinessUserType);
		setOpen(false);
		router.back();
	};

	if (!id) {
		router.back();
		return;
	}

	if (loading) return <Loading />;

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

	if (!bussinessUserDetails || !bussinessUserType) return null;

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
						<View className="mt-2 flex-row gap-3">
							<TouchableOpacity
								activeOpacity={0.85}
								onPress={() => call(bussinessUserDetails.phone_number)}
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
								onPress={() => message(bussinessUserDetails.phone_number)}
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
						bussinessUserType={bussinessUserType}
						deleteBussinessUserSection={deleteBussinessUserSection}
						sales={bussinessUserDetails.section_sales}
						createBussinessUserSection={createBussinessUserSection}
						userId={id}
						user_name={bussinessUserDetails.name}
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
						<BussinessUserDetailsHeaderRight
							default_commission_percent={
								bussinessUserDetails.default_commission_percent
							}
							bussinessUserType={bussinessUserType}
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
								style={{
									marginLeft: 5,
									marginRight: 15,
									marginBottom: 5,
								}}
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
								style={{
									color: "#e5e7eb",
									fontWeight: "600",
									fontSize: 20,
								}}
							>
								{bussinessUserType === "commission_user"
									? "Commission User"
									: "Resold User"}
							</Text>
						</View>
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
