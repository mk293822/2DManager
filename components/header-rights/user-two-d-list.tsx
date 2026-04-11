import { BussinessUserType } from "@/types/bussiness-user-types";
import { SectionName } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const UserTwoDListHeaderRight = ({
	id,
	section,
	bussinessUserType,
}: {
	id: string;
	bussinessUserType: BussinessUserType;
	section: SectionName;
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
						pathname:
							"/bussiness-user-details/bussiness-user-two-d-list/list-numbers",
						params: {
							id: id,
							section: section,
							bussinessUserType,
						},
					})
				}
			>
				<AntDesign
					name="unordered-list"
					size={22}
					color="#fff"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default UserTwoDListHeaderRight;
