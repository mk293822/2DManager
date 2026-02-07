import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HomePageHeaderRight = () => {
	return (
		<View className="flex-row gap-2 pr-4 items-center">
			<TouchableOpacity
				activeOpacity={0.5}
				className="p-2 rounded-full"
				onPress={() => router.push("/two-d/results-history")}
			>
				<AntDesign
					name="calendar"
					size={22}
					color="#e5e7eb"
				/>
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.5}
				className="p-2 rounded-full"
				onPress={() => router.push("/two-d/three-d-result")}
			>
				<Text className="text-2xl font-extrabold text-gray-200">3D</Text>
			</TouchableOpacity>

			<TouchableOpacity
				activeOpacity={0.5}
				className="p-2 rounded-full"
				onPress={() => router.push("/two-d/history")}
			>
				<AntDesign
					name="history"
					size={22}
					color="#e5e7eb"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default HomePageHeaderRight;
