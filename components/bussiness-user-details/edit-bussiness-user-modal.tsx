import { EVENT_NAMES } from "@/event-names";
import { BussinessUserEditFields } from "@/hooks/bussiness-user-details/use-bussiness-user-details-hook";
import { MutationResult } from "@/hooks/use-mutation";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors } from "@/lib/helpers";
import {
	BussinessUser,
	BussinessUserPayload,
	BussinessUserType,
} from "@/types/bussiness-user-types";
import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import AppModal from "../ui/app-modal";
import NumericInput from "../ui/numeric-input";
import PhoneNumberInput from "../ui/phone-number-input";

type Props = {
	open: boolean;
	onClose: () => void;
	editBussinessUserDetails: (
		variables: Partial<BussinessUser>,
	) => Promise<
		MutationResult<BussinessUser, ParsedErrors<BussinessUserEditFields>>
	>;
	name: string;
	phone_number: string;
	default_commission_percent: number;
	default_draw_times?: number;
	bussinessUserType: BussinessUserType;
};

const EditBussinessUserModal = ({
	open,
	onClose,
	editBussinessUserDetails,
	name,
	phone_number,
	default_commission_percent,
	default_draw_times,
	bussinessUserType,
}: Props) => {
	const [form, setForm] = useState<{
		name: string;
		phone_number: string;
		default_commission_percent: number;
		default_draw_times: number;
	}>({
		name: name,
		phone_number: phone_number,
		default_commission_percent: default_commission_percent,
		default_draw_times: default_draw_times ?? 0,
	});
	const [loading, setLoading] = useState(false);

	const [error, setErrors] = useState<
		Partial<Record<BussinessUserEditFields, string>>
	>({});

	const handleChange = (key: keyof typeof form, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleClose = () => {
		onClose();
		setErrors({});
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			const payload: BussinessUserPayload =
				bussinessUserType === "resold_user"
					? {
							name: form.name,
							phone_number: form.phone_number,
							default_commission_percent: form.default_commission_percent,
							default_draw_times: form.default_draw_times!,
						}
					: {
							name: form.name,
							phone_number: form.phone_number,
							default_commission_percent: form.default_commission_percent,
						};
			const res = await editBussinessUserDetails(payload);
			if (!res.error) {
				handleClose();
				setErrors({});
				return;
			} else if (res.error.form && Object.keys(res.error.fields).length === 0) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Edit Failed",
					description: res.error.form,
				});
			} else {
				setErrors(res.error.fields);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<AppModal
			open={open}
			loading={loading}
		>
			<View className="bg-gray-100 w-full flex-col rounded-2xl p-6 py-8 shadow-lg">
				<Text className="text-xl font-bold text-indigo-700 mb-4">
					Edit Commission User
				</Text>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerClassName="flex-col gap-2"
				>
					<Text className="font-semibold text-gray-700">Name</Text>
					<TextInput
						value={form.name}
						onChangeText={(text) => handleChange("name", text)}
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>
					{error.name && (
						<Text className="text-red-500 text-sm">{error.name}</Text>
					)}

					<PhoneNumberInput
						label="Phone Number"
						value={form.phone_number}
						onChange={(val) => handleChange("phone_number", val)}
						error={error.phone_number}
					/>

					<NumericInput
						label="Default Commission %"
						value={form.default_commission_percent}
						onChange={(val) => handleChange("default_commission_percent", val)}
						error={error.default_commission_percent}
						min={0}
						max={100}
					/>
					{bussinessUserType === "resold_user" && form.default_draw_times && (
						<NumericInput
							label="Default Draw Times"
							value={form.default_draw_times}
							onChange={(val) => handleChange("default_draw_times", val)}
							error={error.default_draw_times}
						/>
					)}
				</ScrollView>

				{/* Buttons */}
				<View
					className="w-full flex-row items-center mt-4 gap-2"
					style={{ justifyContent: "flex-end" }}
				>
					<TouchableOpacity
						onPress={handleClose}
						className="px-4 py-2 rounded-lg bg-white border border-gray-300"
					>
						<Text className="font-semibold text-gray-700">Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleSave}
						disabled={loading}
						className="px-4 disabled:bg-indigo-500 py-2 rounded-lg bg-indigo-600 border border-indigo-600"
					>
						<Text className="font-semibold text-white">Save</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AppModal>
	);
};

export default EditBussinessUserModal;
