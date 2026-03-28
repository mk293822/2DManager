import { BussinessUserEditFields } from "@/hooks/bussiness-user-details/use-bussiness-user-details-hook";
import { MutationResult } from "@/hooks/use-mutation";
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
	default_draw_times,
}: {
	editBussinessUserDetails: (
		variables: Partial<BussinessUser>,
	) => Promise<
		MutationResult<BussinessUser, ParsedErrors<BussinessUserEditFields>>
	>;
	id: string;
	name: string;
	phone_number: string;
	default_commission_percent: number;
	bussinessUserType: BussinessUserType;
	default_draw_times: number;
}) => {
	const [open, setOpen] = useState(false);

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
							params: { id: id, bussinessUserType },
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
				editBussinessUserDetails={editBussinessUserDetails}
				name={name}
				phone_number={phone_number}
				default_commission_percent={default_commission_percent}
				default_draw_times={default_draw_times}
			/>
		</>
	);
};

export default BussinessUserDetailsHeaderRight;
