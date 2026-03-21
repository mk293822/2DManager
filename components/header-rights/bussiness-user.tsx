import { BussinessUserEditFields } from "@/hooks/bussiness-user-details/use-user-details-hook";
import { ParsedErrors } from "@/lib/helpers";
import { BussinessUser, BussinessUserType } from "@/types/bussiness-user-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import CreateBussinessUserModal from "../bussiness-user-details/create-bussiness-user-modal";

const BussinessUserPageHeaderRight = ({
	handleCreateBussinessUser,
	bussinessUserType,
}: {
	handleCreateBussinessUser: (
		payload: Partial<BussinessUser>,
		bussinessUserType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserEditFields>;
	}>;
	bussinessUserType: BussinessUserType;
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
			<CreateBussinessUserModal
				bussinessUserType={bussinessUserType}
				open={open}
				handleCreateBussinessUser={handleCreateBussinessUser}
				onClose={() => setOpen(false)}
			/>
		</View>
	);
};

export default BussinessUserPageHeaderRight;
