import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

/* ================= MOCK PROFILE DATA ================= */

const profile = {
	name: "Minkhant",
	role: "Admin",
	phone: "+95 9 123 456 789",
	email: "admin@example.com",
	totalSold: 45_800_000,
	totalCommission: 2_290_000,
};

const formatKs = (num: number) => `${num.toLocaleString()} Ks`;

/* ================= COMPONENT ================= */

const Profile = () => {
	return (
		<ScrollView
			className="flex-1 bg-gray-100 p-4"
			contentContainerStyle={{ paddingBottom: 120 }}
		>
			{/* ===== PROFILE HEADER ===== */}
			<View className="bg-white rounded-2xl shadow p-6 mb-6 items-center">
				<View className="w-20 h-20 rounded-full bg-indigo-600 items-center justify-center mb-3">
					<Text className="text-white text-3xl font-extrabold">
						{profile.name.charAt(0)}
					</Text>
				</View>

				<Text className="text-indigo-700 font-extrabold text-2xl">
					{profile.name}
				</Text>
				<Text className="text-gray-500 mt-1">{profile.role}</Text>
			</View>

			{/* ===== STATS CARD ===== */}
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<Text className="text-indigo-700 font-extrabold text-xl mb-4">
					Statistics
				</Text>

				<View className="flex-row justify-between py-2 border-b border-gray-100">
					<Text className="text-gray-600">Total Sold</Text>
					<Text className="font-semibold">{formatKs(profile.totalSold)}</Text>
				</View>

				<View className="flex-row justify-between py-2">
					<Text className="text-gray-600">Total Commission</Text>
					<Text className="font-semibold text-indigo-600">
						{formatKs(profile.totalCommission)}
					</Text>
				</View>
			</View>

			{/* ===== ACCOUNT INFO ===== */}
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<Text className="text-indigo-700 font-extrabold text-xl mb-4">
					Account Info
				</Text>

				<View className="flex-row items-center gap-3 py-2">
					<AntDesign
						name="phone"
						size={18}
						color="#4f46e5"
					/>
					<Text className="text-gray-700">{profile.phone}</Text>
				</View>

				<View className="flex-row items-center gap-3 py-2">
					<AntDesign
						name="mail"
						size={18}
						color="#4f46e5"
					/>
					<Text className="text-gray-700">{profile.email}</Text>
				</View>
			</View>

			{/* ===== ACTIONS ===== */}
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<TouchableOpacity
					activeOpacity={0.8}
					className="flex-row items-center justify-between py-3"
				>
					<Text className="font-semibold text-gray-700">Edit Profile</Text>
					<AntDesign
						name="right"
						size={16}
						color="#9ca3af"
					/>
				</TouchableOpacity>

				<View className="h-px bg-gray-100 my-2" />

				<TouchableOpacity
					activeOpacity={0.8}
					className="flex-row items-center justify-between py-3"
				>
					<Text className="font-semibold text-gray-700">Change Password</Text>
					<AntDesign
						name="right"
						size={16}
						color="#9ca3af"
					/>
				</TouchableOpacity>
			</View>

			{/* ===== LOGOUT ===== */}
			<View className="bg-white border border-red-200 rounded-2xl p-6">
				<TouchableOpacity
					activeOpacity={0.85}
					className="bg-red-600 rounded-xl py-3 items-center"
				>
					<Text className="text-white font-extrabold text-base">Log Out</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

export default Profile;
