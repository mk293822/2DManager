import { EVENT_NAMES } from "@/event-names";
import { EditUserFields } from "@/hooks/auth/use-auth";
import { MutationResult } from "@/hooks/use-mutation";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors } from "@/lib/helpers";
import { User } from "@/types/main";
import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import AppModal from "../ui/app-modal";
import PhoneNumberInput from "../ui/phone-number-input";

type Props = {
	open: boolean;
	onClose: () => void;
	name: string;
	phone_number: string;
	editUserDetails: (variables: {
		name: string;
		phone_number: string;
	}) => Promise<MutationResult<User, ParsedErrors<EditUserFields>>>;
	updatingProfile: boolean;
};

const EditUserProfileModal = ({
	open,
	onClose,
	editUserDetails,
	name,
	phone_number,
	updatingProfile,
}: Props) => {
	const [form, setForm] = useState<{ name: string; phone_number: string }>({
		name,
		phone_number,
	});

	const [errors, setErrors] = useState<Partial<Record<EditUserFields, string>>>(
		{},
	);

	const handleChange = (key: keyof typeof form, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const onCloseModal = () => {
		onClose();
		setErrors({});
	};

	const handleSave = async () => {
		const res = await editUserDetails(form);

		if (!res.error) {
			setErrors({});
			onCloseModal();
			return;
		} else if (res.error.form && Object.keys(res.error.fields).length === 0) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Update Failed",
				description: res.error.form,
			});
		} else {
			setErrors(res.error.fields);
		}
	};

	return (
		<AppModal
			open={open}
			loading={updatingProfile}
		>
			<View className="bg-gray-100 w-full flex-col rounded-2xl p-6 py-8 shadow-lg">
				<Text className="text-xl font-bold text-indigo-700 mb-4">
					Edit User Profile
				</Text>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerClassName="flex-col gap-2"
				>
					{/* Name */}
					<Text className="font-semibold text-gray-700">Name</Text>

					<TextInput
						value={form.name}
						onChangeText={(text) => handleChange("name", text)}
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>

					{errors.name && (
						<Text className="text-red-500 text-sm">{errors.name}</Text>
					)}

					{/* Phone */}
					<PhoneNumberInput
						label="Phone Number"
						value={form.phone_number}
						onChange={(val) => handleChange("phone_number", val)}
						error={errors.phone_number}
					/>
				</ScrollView>

				{/* Buttons */}
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
						disabled={updatingProfile}
						className="px-4 py-2 rounded-lg disabled:bg-indigo-500 bg-indigo-600 border border-indigo-600"
					>
						<Text className="font-semibold text-white">Save</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AppModal>
	);
};

export default EditUserProfileModal;
