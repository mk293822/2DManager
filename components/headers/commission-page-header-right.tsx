// components/headers/commission-page-header-right.tsx
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
	onAddUser?: () => void; // optional callback when button pressed
};

const CommissionPageHeaderRight: React.FC<Props> = ({ onAddUser }) => {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingRight: 12,
			}}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={onAddUser}
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: "#f3f4f6", // indigo
					paddingHorizontal: 14,
					paddingVertical: 6,
					borderRadius: 20,
				}}
			>
				<AntDesign
					name="plus"
					size={16}
					color="#4f46e5"
					style={{ marginRight: 6 }}
				/>
				<Text style={{ color: "#4f46e5", fontWeight: "600" }}>Add User</Text>
			</TouchableOpacity>
		</View>
	);
};

export default CommissionPageHeaderRight;
