import { useCommissionUserContext } from "@/hooks/commission-users/use-commission-user-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import CreateCommissionUserModal from "../commission-user-details/create-commission-user-modal";

const CommissionUserPageHeaderRight = () => {
	const [open, setOpen] = useState(false);
	const { handleCreateCommissionUser } = useCommissionUserContext();

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingRight: 12,
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
