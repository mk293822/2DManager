// app/commission-users.tsx
import { useCommissionUserDataContext } from "@/hooks/use-commission-user-data-context";
import { useRouter } from "expo-router";
import React from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const CommissionUsers = () => {
	const router = useRouter();
	const { commissionUsers, loading, error, reset } =
		useCommissionUserDataContext();

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

	if (loading || !commissionUsers) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 p-4">
				<ActivityIndicator
					size={50}
					color="#2563eb"
				/>
			</View>
		);
	}

	if (commissionUsers.length === 0) {
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
		<ScrollView
			className="flex-1 bg-gray-100 p-4"
			contentContainerStyle={{ paddingBottom: 120 }}
		>
			{commissionUsers.map((user) => (
				<TouchableOpacity
					key={user.id}
					onPress={() =>
						router.push({
							pathname: "/commission-users/[id]",
							params: { id: String(user.id) },
						})
					}
					activeOpacity={0.8}
					className="bg-white rounded-2xl shadow p-4 mb-4 flex-row items-center justify-between"
				>
					{/* User info */}
					<View>
						<Text className="text-indigo-700 font-extrabold text-lg">
							{user.name}
						</Text>
						<Text className="text-gray-500 mt-1">{user.phone_number}</Text>
					</View>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

export default CommissionUsers;
