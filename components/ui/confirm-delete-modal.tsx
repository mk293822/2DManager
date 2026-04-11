import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AppModal from "../ui/app-modal";

type ConfirmDeleteModalProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void> | void;
	loading?: boolean;
	title: string;
	description: string;
};

const ConfirmDeleteModal = ({
	open,
	onClose,
	onConfirm,
	loading,
	title,
	description,
}: ConfirmDeleteModalProps) => {
	return (
		<AppModal
			open={open}
			loading={loading}
		>
			<View className="bg-white w-full max-w-md mx-auto p-6 rounded-3xl shadow-xl">
				{/* Icon */}
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
					{title}
				</Text>

				{/* Description */}
				<Text className="text-gray-700 text-center mb-6">{description}</Text>

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
						onPress={onConfirm}
						disabled={loading}
						className="flex-1 px-4 py-3 rounded-lg bg-red-600"
					>
						<Text className="text-white font-semibold text-center">Delete</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AppModal>
	);
};

export default ConfirmDeleteModal;
