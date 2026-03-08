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
	editUserDetails: (form: {
		name: string;
		phone_number: string;
	}) => Promise<void>;
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
		name: name,
		phone_number: phone_number,
	});

	const handleChange = (key: keyof typeof form, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	useEffect(() => {
		if (form.name === "" || form.phone_number === "") {
			setForm({
				name: name,
				phone_number: phone_number,
			});
		}
	}, [name, phone_number, form]);

	const onCloseModal = () => {
		onClose();
		setForm({ name: "", phone_number: "" });
	};

	const handleSave = async () => {
		setLoading(true);
		await editUserDetails(form);
		setLoading(false);
		onCloseModal();
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
			)}
		</AppModal>
	);
};

export default EditUserProfileModal;
