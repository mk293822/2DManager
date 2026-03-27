import { BussinessUserType } from "@/types/bussiness-user-types";
import { SectionName } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const CreateTwoDNumbersHeaderRight = ({
	id,
	user_name,
	section,
	bussinessUserType,
	draw_times,
}: {
	id: string;
	user_name: string;
	section: SectionName;
	bussinessUserType: BussinessUserType;
	draw_times: number;
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
						pathname: "/bussiness-user-details/bussiness-user-two-d-list/[id]",
						params: {
							id: id,
							section: section,
							userName: user_name,
							draw_times,
							bussinessUserType,
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
