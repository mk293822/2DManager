import { CommissionUserEditFields } from "@/hooks/commission-user-details/use-commission-user-details-hook";
import { ParsedErrors } from "@/lib/helpers";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import EditCommissionUserModal from "../commission-user-details/edit-commission-user-modal";

const CommissionUserDetailsHeaderRight = ({
	editCommissionUserDetails,
	id,
	name,
	phone_number,
	default_commission_percent,
}: {
	editCommissionUserDetails: (
		id: string,
		form: {
			name: string;
			phone_number: string;
			default_commission_percent: number;
		},
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<CommissionUserEditFields>;
	}>;
	id: string;
	name: string;
	phone_number: string;
	default_commission_percent: number;
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
							pathname: "/commission-user-details/section-sales",
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
			<EditCommissionUserModal
				open={open}
				onClose={() => setOpen(false)}
				id={id}
				editCommissionUserDetails={editCommissionUserDetails}
				name={name}
				phone_number={phone_number}
				default_commission_percent={default_commission_percent}
			/>
		</>
	);
};

export default CommissionUserDetailsHeaderRight;
