import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AppModal from "../ui/app-modal";

type DeleteBussinessUserModalProps = {
	open: boolean;
	onClose: () => void;
	handleDelete: () => Promise<void>;
	user_name: string;
};

const DeleteBussinessUserModal = ({
	open,
	onClose,
	user_name,
	handleDelete,
}: DeleteBussinessUserModalProps) => {
	const [loading, setLoading] = useState(false);

	const handleDeleteUser = async () => {
		try {
			setLoading(true);
			await handleDelete();
		} finally {
			setLoading(false);
			onClose();
			if (router.canGoBack()) {
				router.back();
				return;
			}
			router.replace("/");
		}
	};

	return (
		<AppModal
			open={open}
			loading={loading}
		>
			<View className="bg-white w-full max-w-md mx-auto p-6 rounded-3xl shadow-xl">
				{/* Warning Icon */}
				<View className="flex-row justify-center mb-4">
					<View className="bg-red-100 rounded-full p-4">
						<AntDesign
							size={32}
							color="#DC2626"
							name="alert"
						/>
					</View>
				</View>

				{/* Title */}
				<Text className="text-2xl font-bold text-center text-red-600 mb-3">
					Delete User {user_name}
				</Text>

				{/* Message */}
				<Text className="text-gray-700 text-center mb-6">
					This action cannot be undone. Are you sure you want to permanently
					delete <Text className="font-semibold">user {user_name}</Text>?
				</Text>

				{/* Buttons */}
				<View className="flex-row justify-between gap-3">
					<TouchableOpacity
						onPress={onClose}
						className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
					>
						<Text className="text-gray-700 font-semibold text-center">
							Cancel
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						disabled={loading}
						onPress={handleDeleteUser}
						className="flex-1 px-4 py-3 rounded-lg bg-red-600"
					>
						<Text className="text-white font-semibold text-center">Delete</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AppModal>
	);
};

export default DeleteBussinessUserModal;
