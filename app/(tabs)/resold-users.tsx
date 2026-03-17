import BussinessPage from "@/components/bussiness-user-details/bussiness-page";
import BussinessUserPageHeaderRight from "@/components/header-rights/bussiness-user";
import { useBussinessUserContext } from "@/hooks/bussiness-users/use-context";
import { BussinessUser } from "@/types/bussiness-user-types";
import { Tabs, useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const ResoldUsers = () => {
	const router = useRouter();
	const {
		bussinessUsers,
		loading,
		error,
		fetchBussinessUsers,
		handleCreateBussinessUser,
		setUserType,
	} = useBussinessUserContext();

	useFocusEffect(() => {
		setUserType("resold_user");
	});

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		const controller = new AbortController();
		setRefreshing(true);
		await fetchBussinessUsers(controller.signal, false);
		setRefreshing(false);
	};

	const renderItem = ({ item }: { item: BussinessUser }) => (
		<View
			key={item.id}
			className="flex-1 bg-white rounded-2xl shadow p-4 mb-4 flex-row items-center justify-between"
		>
			<TouchableOpacity
				onPress={() =>
					router.push({
						pathname: "/bussiness-user-details/[id]",
						params: { id: String(item.id), userType: "resold_user" },
					})
				}
				activeOpacity={0.8}
				className="flex-1 flex-row items-center justify-between"
			>
				<View>
					<Text className="text-indigo-700 text-lg">{item.name}</Text>
					<Text className="text-gray-500 mt-1">{item.phone_number}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);

	return (
		<>
			<Tabs.Screen
				options={{
					headerRight: () => (
						<BussinessUserPageHeaderRight
							userType="resold_user"
							handleCreateBussinessUser={handleCreateBussinessUser}
						/>
					),
				}}
			/>
			<BussinessPage
				loading={loading}
				error={error}
				onReload={onRefresh}
				empty={!bussinessUsers || bussinessUsers.length === 0}
				emptyMessage="No Resold user yet!"
			>
				<FlatList
					data={bussinessUsers}
					renderItem={renderItem}
					keyExtractor={(item) => item.id.toString()}
					refreshControl={
						<RefreshControl
							colors={["#0000ff"]}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
				/>
			</BussinessPage>
		</>
	);
};

export default ResoldUsers;
