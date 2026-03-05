import { EVENT_NAMES } from "@/event-names";
import { useAuthContext } from "@/hooks/use-auth-context";
import { eventBus } from "@/lib/event-bus";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
	const { isAuthenticated, user, logout, fetchUser } = useAuthContext();

	const onCopy = async () => {
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		await Clipboard.setStringAsync(user?.uuid || "");
		eventBus.emit(EVENT_NAMES.NOTIFICATION, {
			title: "Copied!",
			description: "User ID Copied Successfully!",
			type: "success",
		});
	};

	if (!isAuthenticated) {
		return (
			<View className="flex-1 bg-gray-100 justify-center px-6 pb-24">
				<View className="bg-white rounded-2xl p-6 gap-4 shadow-sm items-center">
					<Text className="text-xl font-bold">You’re not logged in</Text>

					<Text className="text-gray-500 text-center">
						Please login to view your profile
					</Text>

					<Link
						href="/login"
						asChild
					>
						<TouchableOpacity
							activeOpacity={0.85}
							className="bg-indigo-400 py-3 px-10 rounded-lg mt-2"
						>
							<Text className="text-white font-bold text-lg text-center">
								Login
							</Text>
						</TouchableOpacity>
					</Link>
				</View>
			</View>
		);
	}

	return (
		<ScrollView
			className="flex-1 bg-gray-100 p-4"
			contentContainerStyle={{ paddingBottom: 120 }}
		>
			{/* ===== PROFILE HEADER ===== */}
			<View className="bg-white rounded-2xl shadow p-6 mb-6 items-center">
				<View className="w-20 h-20 rounded-full bg-indigo-600 items-center justify-center mb-3">
					<Text className="text-white text-3xl font-extrabold">
						{user?.name.charAt(0)}
					</Text>
				</View>

				<Text className="text-indigo-700 font-extrabold text-2xl">
					{user?.name}
				</Text>
			</View>

			{/* ===== ACCOUNT INFO ===== */}
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<Text className="text-indigo-700 font-extrabold text-xl mb-4">
					Account Info
				</Text>

				<TouchableOpacity
					activeOpacity={0.5}
					onPress={onCopy}
					className="flex-row items-center gap-3 py-2"
				>
					<AntDesign
						name="idcard"
						size={18}
						color="#4f46e5"
					/>
					<Text className="text-gray-700">{user?.uuid}</Text>
				</TouchableOpacity>
				<View className="flex-row items-center gap-3 py-2">
					<AntDesign
						name="phone"
						size={18}
						color="#4f46e5"
					/>
					<Text className="text-gray-700">{user?.phone_number}</Text>
				</View>
			</View>

			{/* ===== STATS CARD ===== */}
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<Text className="text-indigo-700 font-extrabold text-xl mb-4">
					Account Status
				</Text>

				<View className="flex-row justify-between py-2 border-b border-gray-100">
					<Text className="text-gray-600">Status</Text>
					<Text className="font-semibold">
						{user?.is_active ? "Active" : "Inactive"}
					</Text>
				</View>

				<View className="flex-row justify-between py-2">
					<Text className="text-gray-600">Role</Text>
					<Text className="font-semibold text-indigo-600">
						{user?.is_staff ? "Admin" : "User"}
					</Text>
				</View>
			</View>

			{/* ===== ACTIONS ===== */}
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<TouchableOpacity
					onPress={fetchUser}
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
					onPress={logout}
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
