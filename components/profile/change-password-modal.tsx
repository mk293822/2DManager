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
	changePassword: (form: {
		current_password: string;
		new_password: string;
		confirm_password: string;
	}) => Promise<any>;
	errors: {
		current_password?: string | undefined;
		new_password?: string | undefined;
		confirm_password?: string | undefined;
	};
	fetchUser: () => void;
};

const ChangePasswordModal = ({
	open,
	onClose,
	changePassword,
	errors,
	fetchUser,
}: Props) => {
	const [form, setForm] = useState<{
		current_password: string;
		new_password: string;
		confirm_password: string;
	}>({
		current_password: "",
		new_password: "",
		confirm_password: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (key: keyof typeof form, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const onCloseModal = () => {
		onClose();
		setForm({ current_password: "", new_password: "", confirm_password: "" });
	};

	const handleSave = async () => {
		// Clear previous errors
		setLoading(true);
		const success = await changePassword(form);
		setLoading(false);
		if (success) {
			onCloseModal();
			fetchUser();
		}
		setForm({
			current_password: form.current_password,
			new_password: "",
			confirm_password: "",
		});
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
						Create Commission User
					</Text>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerClassName="flex-col gap-2"
					>
						<Text className="font-semibold text-gray-700">
							Current Password
						</Text>
						<TextInput
							secureTextEntry
							value={form.current_password}
							onChangeText={(text) => handleChange("current_password", text)}
							className="border border-gray-300 rounded-lg px-3 py-2"
						/>
						{errors.current_password && (
							<Text className="text-red-500 text-sm">
								{errors.current_password}
							</Text>
						)}

						<Text className="font-semibold text-gray-700">New Passwrod</Text>
						<TextInput
							secureTextEntry
							value={form.new_password}
							onChangeText={(text) => handleChange("new_password", text)}
							className="border border-gray-300 rounded-lg px-3 py-2"
						/>
						{errors.new_password && (
							<Text className="text-red-500 text-sm">
								{errors.new_password}
							</Text>
						)}

						<Text className="font-semibold text-gray-700">
							Confirm Passwrod
						</Text>
						<TextInput
							secureTextEntry
							value={form.confirm_password}
							onChangeText={(text) => handleChange("confirm_password", text)}
							className="border border-gray-300 rounded-lg px-3 py-2"
						/>
						{errors.confirm_password && (
							<Text className="text-red-500 text-sm">
								{errors.confirm_password}
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

export default ChangePasswordModal;
