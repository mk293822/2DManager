// CommissionUsers.tsx
import CommissionUserPageHeaderRight from "@/components/header-rights/commission-user";
import { Loading } from "@/components/loading";
import { useCommissionUserContext } from "@/hooks/commission-users/use-commission-user-context";
import { CommissionUserType } from "@/types/commission-user-types";
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	Pressable,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const CommissionUsers = () => {
	const router = useRouter();
	const {
		commissionUsers,
		loading,
		error,
		fetchCommissionUsers,
		handleCreateCommissionUser,
	} = useCommissionUserContext();
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		const controller = new AbortController();

		setRefreshing(true);
		await fetchCommissionUsers(controller.signal, false); // assuming reset fetches data again
		setRefreshing(false);
	};

	const renderItem = ({ item }: { item: CommissionUserType }) => (
		<View
			key={item.id}
			className="flex-1 bg-white rounded-2xl shadow p-4 mb-4 flex-row items-center justify-between"
		>
			<TouchableOpacity
				onPress={() =>
					router.push({
						pathname: "/commission-user-details/[id]",
						params: { id: String(item.id) },
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
						<CommissionUserPageHeaderRight
							handleCreateCommissionUser={handleCreateCommissionUser}
						/>
					),
				}}
			/>
			{error ? (
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
			) : loading ? (
				<Loading />
			) : !commissionUsers || commissionUsers.length === 0 ? (
				<View className="flex-1 items-center justify-center bg-gray-100 p-4">
					<Text className="text-gray-500 font-semibold text-2xl text-center mb-4">
						No Commission user yet!
					</Text>
					<Pressable
						onPress={onRefresh}
						className="bg-indigo-600 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				</View>
			) : (
				<FlatList
					data={commissionUsers}
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
			)}
		</>
	);
};

export default CommissionUsers;
