import CommissionUserPageHeaderRight from "@/components/header-rights/commission-user";
import { Loading } from "@/components/loading";
import { useCommissionUserContext } from "@/hooks/commission-users/use-commission-user-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import {
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const CommissionUsers = () => {
	const router = useRouter();
	const { commissionUsers, loading, error, reset, handleCreateCommissionUser } =
		useCommissionUserContext();

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4">
				<Text className="text-red-600 font-semibold text-center mb-4">
					{error}
				</Text>
				<Pressable
					onPress={reset}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}

	if (!commissionUsers || commissionUsers.length === 0) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 p-4">
				<Text className="text-gray-500 font-semibold text-2xl text-center mb-4">
					No Commission user yet!
				</Text>
				<Pressable
					onPress={reset}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}

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
			<ScrollView
				className="flex-1 bg-gray-100 p-4"
				contentContainerStyle={{ paddingBottom: 120 }}
			>
				{commissionUsers.map((user) => (
					<View
						key={user.id}
						className="flex-1 bg-white rounded-2xl shadow p-4 mb-4 flex-row items-center justify-between"
					>
						<TouchableOpacity
							onPress={() =>
								router.push({
									pathname: "/commission-user-details/[id]",
									params: { id: String(user.id) },
								})
							}
							activeOpacity={0.8}
							className="flex-1 flex-row items-center justify-between"
						>
							<View>
								<Text className="text-indigo-700 text-lg">{user.name}</Text>
								<Text className="text-gray-500 mt-1">{user.phone_number}</Text>
							</View>
						</TouchableOpacity>
						<View className="pr-2">
							<TouchableOpacity
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
							>
								<AntDesign
									name="plus"
									size={18}
									color={"#6b7280"}
								/>
							</TouchableOpacity>
						</View>
					</View>
				))}
			</ScrollView>
		</>
	);
};

export default CommissionUsers;
