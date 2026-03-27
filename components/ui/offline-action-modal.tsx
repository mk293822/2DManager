import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AppModal from "./app-modal";

type Props = {
	open: boolean;
	message: string;
	onRetry: () => void;
	onClose: () => void;
};

const OfflineActionModal = ({ open, message, onRetry, onClose }: Props) => {
	return (
		<AppModal open={open}>
			<View className="bg-gray-100 px-6 py-6 rounded-3xl w-[85%] self-center shadow-lg">
				{/* Top Accent */}
				<AntDesign
					name="wifi"
					size={50}
					color={"#6366f1"}
					className="text-center"
				/>

				{/* Title */}
				<Text className="text-indigo-600 text-xl font-semibold text-center mb-2">
					No Connection
				</Text>

				{/* Message */}
				<Text className="text-gray-500 text-center leading-5 mb-6">
					{message || "Please check your connection and try again."}
				</Text>

				{/* Primary Button */}
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={onRetry}
					className="bg-indigo-600 py-3 rounded-xl mb-3"
				>
					<Text className="text-white text-center font-semibold text-base">
						Retry
					</Text>
				</TouchableOpacity>

				{/* Secondary Action */}
				<TouchableOpacity onPress={onClose}>
					<Text className="text-indigo-600 text-center text-sm font-medium">
						Cancel
					</Text>
				</TouchableOpacity>
			</View>
		</AppModal>
	);
};

export default OfflineActionModal;
