import { BussinessUserEditFields } from "@/hooks/bussiness-user-details/use-user-details-hook";
import { ParsedErrors } from "@/lib/helpers";
import { BussinessUser, BussinessUserType } from "@/types/bussiness-user-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import EditBussinessUserModal from "../bussiness-user-details/edit-bussiness-user-modal";

const BussinessUserDetailsHeaderRight = ({
	editBussinessUserDetails,
	id,
	name,
	phone_number,
	default_commission_percent,
	bussinessUserType,
}: {
	editBussinessUserDetails: (
		id: string,
		form: Partial<BussinessUser>,
		bussinessUserType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserEditFields>;
	}>;

	id: string;
	name: string;
	phone_number: string;
	default_commission_percent: number;
	bussinessUserType: BussinessUserType;
}) => {
	const [open, setOpen] = useState(false);

	const userId = Array.isArray(id) ? id[0] : id;
	const router = useRouter();

	return (
		<>
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
							pathname: "/bussiness-user-details/section-sales",
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
			<EditBussinessUserModal
				bussinessUserType={bussinessUserType}
				open={open}
				onClose={() => setOpen(false)}
				id={id}
				editCommissionUserDetails={editBussinessUserDetails}
				name={name}
				phone_number={phone_number}
				default_commission_percent={default_commission_percent}
			/>
		</>
	);
};

export default BussinessUserDetailsHeaderRight;
