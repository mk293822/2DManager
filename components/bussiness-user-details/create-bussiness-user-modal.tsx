// CreateBussinessUserModal.tsx
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
	createBussinessUser: (
		variables: Partial<BussinessUser>,
	) => Promise<
		MutationResult<BussinessUser, ParsedErrors<BussinessUserEditFields>>
	>;
	bussinessUserType: BussinessUserType;
	creatingUser: boolean;
};

type FormState = {
	name: string;
	phone_number: string;
	default_commission_percent: number;
	default_draw_times?: number;
};

const CreateBussinessUserModal = ({
	open,
	onClose,
	createBussinessUser,
	creatingUser,
	bussinessUserType,
}: Props) => {
	const [form, setForm] = useState<FormState>({
		name: "",
		phone_number: "",
		default_commission_percent: Number(
			process.env.EXPO_PUBLIC_DEFAULT_COMMISSION_PERCENT ?? 0,
		),
		default_draw_times: Number(process.env.EXPO_PUBLIC_DEFAULT_DRAW_TIMES ?? 0),
	});
	const [error, setErrors] = useState<
		Partial<Record<BussinessUserEditFields, string>>
	>({});

	const handleChange = (key: keyof FormState, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const onCloseModal = () => {
		onClose();
		setForm({
			name: "",
			phone_number: "",
			default_commission_percent: Number(
				process.env.EXPO_PUBLIC_DEFAULT_COMMISSION_PERCENT ?? 0,
			),
			default_draw_times: Number(
				process.env.EXPO_PUBLIC_DEFAULT_DRAW_TIMES ?? 0,
			),
		});
		setErrors({});
	};

	const handleSave = async () => {
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
		const res = await createBussinessUser(payload);

		if (!res.error) {
			onCloseModal();
			return;
		} else if (res.error.form && Object.keys(res.error.fields).length === 0) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Creation Failed",
				description: res.error.form,
			});
		} else {
			setErrors(res.error.fields);
		}
	};

	return (
		<AppModal
			open={open}
			loading={creatingUser}
		>
			<View className="bg-gray-100 w-full max-w-md mx-auto flex-col rounded-2xl p-6 py-8 shadow-lg">
				<Text className="text-xl font-bold text-indigo-700 mb-4">
					Create{" "}
					{bussinessUserType === "commission_user" ? "Commission" : "Resold"}{" "}
					User
				</Text>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ gap: 12 }}
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

				<View
					className="w-full flex-row items-center mt-4 gap-2"
					style={{ justifyContent: "flex-end" }}
				>
					<TouchableOpacity
						onPress={onCloseModal}
						className="px-4 py-2 rounded-lg bg-white border border-gray-300"
					>
						<Text className="font-semibold text-gray-700">Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleSave}
						disabled={creatingUser}
						className="px-4 py-2 rounded-lg bg-indigo-600 disabled:bg-indigo-400 border border-indigo-600"
					>
						<Text className="font-semibold text-white">Save</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AppModal>
	);
};

export default CreateBussinessUserModal;
