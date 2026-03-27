import BussinessUserPageHeaderRight from "@/components/header-rights/bussiness-user";
import PageWrapper from "@/components/page-wrapper";
import useBussinessUserHook from "@/hooks/bussiness-users/use-bussiness-user-hook";
import { BussinessUser } from "@/types/bussiness-user-types";
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const UserType = "commission_user" as const;
const CommissionUsers = () => {
	const router = useRouter();
	const {
		bussinessUsers,
		loading,
		error,
		createBussinessUser,
		creatingUser,
		refetch,
	} = useBussinessUserHook(UserType);

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
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
						params: {
							id: String(item.id),
							bussinessUserType: UserType,
						},
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
							bussinessUserType="commission_user"
							createBussinessUser={createBussinessUser}
							creatingUser={creatingUser}
						/>
					),
				}}
			/>
			<PageWrapper
				loading={loading && !refreshing}
				error={error}
				onReload={refetch}
				empty={!bussinessUsers || bussinessUsers.length === 0}
				emptyMessage="No Commission user yet!"
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
			</PageWrapper>
		</>
	);
};

export default CommissionUsers;
