import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const CommissionUserDetailsHeaderRight = () => {
	const [open, setOpen] = useState(false);
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();

	const userId = Array.isArray(id) ? id[0] : id;
	const router = useRouter();

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: 6,
				paddingBottom: 4,
			}}
		>
			<TouchableOpacity
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				onPress={() => setOpen(true)}
				style={{
					padding: 6,
					borderRadius: 999,
				}}
			>
				<AntDesign
					name="edit"
					size={22}
					color="#fff"
				/>
			</TouchableOpacity>

			<TouchableOpacity
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				onPress={() =>
					router.push({
						pathname: "/commission-user-details/section-sales",
						params: { id: userId },
					})
				}
				style={{
					padding: 6,
					borderRadius: 999,
				}}
			>
				<AntDesign
					name="bars"
					size={28}
					color="#fff"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default CommissionUserDetailsHeaderRight;
