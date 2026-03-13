import { EVENT_NAMES } from "@/event-names";
import { CommissionUserEditFields } from "@/hooks/commission-user-details/use-commission-user-details-hook";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors } from "@/lib/helpers";
import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Loading } from "../loading";
import AppModal from "../ui/app-modal";

type Props = {
	open: boolean;
	onClose: () => void;
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
};

const EditCommissionUserModal = ({
	open,
	onClose,
	editCommissionUserDetails,
	id,
	name,
	phone_number,
	default_commission_percent,
}: Props) => {
	const [form, setForm] = useState<{
		name: string;
		phone_number: string;
		default_commission_percent: number;
	}>({
		name: name,
		phone_number: phone_number,
		default_commission_percent: default_commission_percent,
	});
	const [loading, setLoading] = useState(false);

	const [errors, setErrors] = useState<
		Partial<Record<CommissionUserEditFields, string>>
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
			const res = await editCommissionUserDetails(id, form);
			if (res.success) {
				handleClose();
				setErrors({});
				return;
			}

			if (res.errors.form && Object.keys(res.errors.fields).length === 0) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Edit Failed",
					description: res.errors.form,
				});
			} else {
				setErrors(res.errors.fields);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<AppModal open={open}>
			{loading ? (
				<View className="bg-gray-100 w-1/2 h-40 flex-col rounded-2xl p-6 py-8 shadow-lg">
					<Loading />
				</View>
			) : (
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
						{errors.name && (
							<Text className="text-red-500 text-sm">{errors.name}</Text>
						)}

						<Text className="font-semibold text-gray-700">Phone Number</Text>
						<TextInput
							value={form.phone_number}
							keyboardType="numeric"
							onChangeText={(text) => handleChange("phone_number", text)}
							className="border border-gray-300 rounded-lg px-3 py-2"
						/>
						{errors.phone_number && (
							<Text className="text-red-500 text-sm">
								{errors.phone_number}
							</Text>
						)}

						<Text className="font-semibold text-gray-700">
							Default Commission %
						</Text>
						<TextInput
							value={form.default_commission_percent.toLocaleString()}
							keyboardType="numeric"
							maxLength={3}
							onChangeText={(text) => {
								const clean = text.replace(/,/g, "");
								handleChange("default_commission_percent", Number(clean));
							}}
							className="border border-gray-300 rounded-lg px-3 py-2"
						/>
						{errors.default_commission_percent && (
							<Text className="text-red-500 text-sm">
								{errors.default_commission_percent}
							</Text>
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
			)}
		</AppModal>
	);
};

export default EditCommissionUserModal;
