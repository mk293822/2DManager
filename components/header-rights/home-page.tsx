import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HomePageHeaderRight = () => {
	const router = useRouter();
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingRight: 16,
				gap: 8, // spacing between items
			}}
		>
			{/* Calendar Button */}
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => router.push("/two-d/results-history")}
				style={{
					padding: 8,
					borderRadius: 9999, // full rounded
				}}
			>
				<AntDesign
					name="calendar"
					size={22}
					color="#e5e7eb"
				/>
			</TouchableOpacity>

			{/* 3D Button */}
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => router.push("/two-d/three-d-result")}
				style={{
					padding: 8,
					borderRadius: 9999,
				}}
			>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "800",
						color: "#e5e7eb",
					}}
				>
					3D
				</Text>
			</TouchableOpacity>

			{/* History Button */}
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => router.push("/two-d/history")}
				style={{
					padding: 8,
					borderRadius: 9999,
				}}
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
