import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const CommissionUserDetailsHeaderRight = () => {
	const [open, setOpen] = useState(false);

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
			{/* <CreateCommissionUserModal
				open={open}
				handleCreateCommissionUser={handleCreateCommissionUser}
				onClose={() => setOpen(false)}
			/> */}
		</View>
	);
};

export default CommissionUserDetailsHeaderRight;
