import ManageDaySummary from "@/components/manage-day-summary";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

/* ================= MOCK USER DATA ================= */

const mockUser = {
	id: "10",
	name: "Aung Min",
	totalSold: 12_500_000,
	commission: 625_000,
};

const formatKs = (num: number) => `${num.toLocaleString()} Ks`;

/* ================= COMPONENT ================= */

const CommissionUser = () => {
	const { id } = useLocalSearchParams();

	const handleDeleteUser = () => {
		Alert.alert("Delete User", "This action cannot be undone. Are you sure?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => router.push("/commission-users"),
			},
		]);
	};

	return (
		<PaperProvider>
			<ScrollView
				className="flex-1 bg-gray-100 p-4"
				contentContainerStyle={{ paddingBottom: 40 }}
			>
				{/* ===== USER INFO CARD ===== */}
				<View className="bg-white rounded-2xl shadow p-6 mb-6">
					<Text className="text-indigo-700 font-extrabold text-2xl mb-1">
						{mockUser.name}
					</Text>
					<Text className="text-gray-500 mb-4">Commission User #{id}</Text>

					<View className="flex-row justify-between py-2 border-b border-gray-100">
						<Text className="text-gray-600">Total Sold</Text>
						<Text className="font-semibold">
							{formatKs(mockUser.totalSold)}
						</Text>
					</View>

					<View className="flex-row justify-between py-2">
						<Text className="text-gray-600">Commission</Text>
						<Text className="font-semibold text-indigo-600">
							{formatKs(mockUser.commission)}
						</Text>
					</View>
				</View>

				{/* ===== REUSED MANAGE SUMMARY ===== */}
				<ManageDaySummary />

				{/* ===== DANGER ZONE ===== */}
				<View className="bg-red-100 border border-red-400 rounded-2xl p-6 mt-2">
					<Text className="text-red-600 font-extrabold text-lg mb-2">
						Danger Zone
					</Text>

					<Text className="text-gray-500 mb-4">
						Deleting this user will permanently remove all related data and
						commissions.
					</Text>

					<TouchableOpacity
						activeOpacity={0.85}
						onPress={handleDeleteUser}
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

export default CommissionUser;
