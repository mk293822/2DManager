import { BussinessUserEditFields } from "@/hooks/bussiness-user-details/use-bussiness-user-details-hook";
import { MutationResult } from "@/hooks/use-mutation";
import { ParsedErrors } from "@/lib/helpers";
import { BussinessUser, BussinessUserType } from "@/types/bussiness-user-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import CreateBussinessUserModal from "../bussiness-user-details/create-bussiness-user-modal";

const BussinessUserPageHeaderRight = ({
	createBussinessUser,
	bussinessUserType,
	creatingUser,
}: {
	createBussinessUser: (
		variables: Partial<BussinessUser>,
	) => Promise<
		MutationResult<BussinessUser, ParsedErrors<BussinessUserEditFields>>
	>;
	bussinessUserType: BussinessUserType;
	creatingUser: boolean;
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
				createBussinessUser={createBussinessUser}
				creatingUser={creatingUser}
				onClose={() => setOpen(false)}
			/>
		</View>
	);
};

export default BussinessUserPageHeaderRight;
