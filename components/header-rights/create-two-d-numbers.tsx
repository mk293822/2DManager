import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const CreateTwoDNumbersHeaderRight = ({
	id,
	user_name,
}: {
	id: string;
	user_name: string;
}) => {
	const router = useRouter();
	return (
		<View style={{ marginRight: 10 }}>
			<TouchableOpacity
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				style={{
					padding: 6,
					borderRadius: 999,
				}}
				onPress={() =>
					router.push({
						pathname: "/com-user-two-d-list/[id]",
						params: {
							id: id,
							user_name: user_name,
						},
					})
				}
			>
				<AntDesign
					name="history"
					size={22}
					color="#fff"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default CreateTwoDNumbersHeaderRight;
