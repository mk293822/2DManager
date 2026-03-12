import { EVENT_NAMES } from "@/event-names";
import { EditUserFields } from "@/hooks/use-auth";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors } from "@/lib/helpers";
import React, { useEffect, useState } from "react";
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
	name: string;
	phone_number: string;
	editUserDetails: (form: { name: string; phone_number: string }) => Promise<{
		success: boolean;
		errors: ParsedErrors<EditUserFields>;
	}>;
};

const EditUserProfileModal = ({
	open,
	onClose,
	editUserDetails,
	name,
	phone_number,
}: Props) => {
	const [loading, setLoading] = useState(false);

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

	useEffect(() => {
		if (open) {
			setForm({
				name,
				phone_number,
			});
			setErrors({});
		}
	}, [open, name, phone_number]);

	const onCloseModal = () => {
		onClose();
		setForm({ name: "", phone_number: "" });
		setErrors({});
	};

	const handleSave = async () => {
		setLoading(true);

		try {
			const res = await editUserDetails(form);

			if (res.success) {
				setErrors({});
				onCloseModal();
				return;
			}

			// field errors

			if (res.errors.form && Object.keys(res.errors.fields).length === 0) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Update Failed",
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
							className="px-4 py-2 rounded-lg bg-indigo-600 border border-indigo-600"
						>
							<Text className="font-semibold text-white">Save</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</AppModal>
	);
};

export default EditUserProfileModal;
