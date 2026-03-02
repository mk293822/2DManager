import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const UserTwoDList = () => {
	const { handleCreateTwoDList } = useTwoDListsContext();
	const [number, setNumber] = React.useState("");
	const [totalAmount, setTotalAmount] = React.useState(0);
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();
	const sectionId = Array.isArray(id) ? id[0] : id;

	if (!sectionId) return;

	const handleCreate = () =>
		handleCreateTwoDList(sectionId, number, totalAmount);

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				justifyContent: "center",
				padding: 16,
				backgroundColor: "#f3f4f6",
			}}
			keyboardShouldPersistTaps="handled"
		>
			<View className="bg-white rounded-2xl p-6 gap-5 shadow-sm">
				{/* Title */}
				<View className="gap-1">
					<Text className="text-gray-500 text-sm">Create New Number</Text>
				</View>

				<View className="gap-2">
					<Text className="text-sm font-medium text-gray-600">Number</Text>
					<TextInput
						onChangeText={setNumber}
						value={number}
						keyboardType="numeric"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Enter number"
						placeholderTextColor="#9ca3af"
					/>
				</View>

				<View className="gap-2">
					<Text className="text-sm font-medium text-gray-600">
						Total Amount
					</Text>
					<TextInput
						value={totalAmount.toString()}
						onChangeText={(text) => setTotalAmount(Number(text))}
						keyboardType="decimal-pad"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Enter total amount"
						placeholderTextColor="#9ca3af"
					/>
				</View>

				<TouchableOpacity
					activeOpacity={0.85}
					className="bg-indigo-400 py-3 rounded-lg mt-2"
					onPress={handleCreate}
				>
					<Text className="text-white font-bold text-lg text-center">
						Create
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

export default UserTwoDList;
