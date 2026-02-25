import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import AppModal from "../ui/app-modal";

type Props = {
	open: boolean;
	onClose: () => void;
	handleCreateCommissionUser: (payload: {
		name: string;
		phone_number: string;
	}) => Promise<void>;
};

const CreateCommissionUserModal = ({
	open,
	onClose,
	handleCreateCommissionUser,
}: Props) => {
	const [form, setForm] = useState<{ name: string; phone_number: string }>({
		name: "",
		phone_number: "",
	});

	const handleChange = (key: keyof typeof form, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const onCloseModal = () => {
		onClose();
		setForm({ name: "", phone_number: "" });
	};

	const handleSave = async () => {
		onCloseModal();
		await handleCreateCommissionUser(form);
	};

	return (
		<AppModal open={open}>
			<View className="bg-gray-100 w-full flex-col rounded-2xl p-6 py-8 shadow-lg">
				<Text className="text-xl font-bold text-indigo-700 mb-4">
					Create Commission User
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

					<Text className="font-semibold text-gray-700">Phone Number</Text>
					<TextInput
						value={form.phone_number}
						keyboardType="numeric"
						onChangeText={(text) => handleChange("phone_number", text)}
						className="border border-gray-300 rounded-lg px-3 py-2"
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
						className="px-4 py-2 rounded-lg bg-indigo-600 border border-indigo-600"
					>
						<Text className="font-semibold text-white">Save</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AppModal>
	);
};

export default CreateCommissionUserModal;
