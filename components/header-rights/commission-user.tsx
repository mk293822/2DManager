import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import CreateCommissionUserModal from "../commission-user-details/create-commission-user-modal";

const CommissionUserPageHeaderRight = ({
	handleCreateCommissionUser,
}: {
	handleCreateCommissionUser: (payload: {
		name: string;
		phone_number: string;
	}) => Promise<void>;
}) => {
	const [open, setOpen] = useState(false);

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingRight: 20,
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
					name="plus"
					size={22}
					color="#fff"
				/>
			</TouchableOpacity>
			<CreateCommissionUserModal
				open={open}
				handleCreateCommissionUser={handleCreateCommissionUser}
				onClose={() => setOpen(false)}
			/>
		</View>
	);
};

export default CommissionUserPageHeaderRight;
