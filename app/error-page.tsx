import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ErrorPage = () => {
	const navigation = useNavigation<any>();

	return (
		<View className="flex-1 bg-white items-center justify-center px-6">
			{/* Error Icon / Title */}
			<Text className="text-red-600 text-5xl mb-4">⚠️</Text>

			<Text className="text-gray-800 text-2xl font-extrabold text-center mb-2">
				Something went wrong
			</Text>

			<Text className="text-gray-500 text-center mb-6">
				An unexpected error occurred. Please try again or return to a safe page.
			</Text>

			{/* Actions */}
			<View className="w-full gap-3">
				<TouchableOpacity
					activeOpacity={0.85}
					onPress={() => navigation.goBack()}
					className="bg-gray-200 py-3 rounded-xl"
				>
					<Text className="text-gray-700 font-semibold text-center">
						Go Back
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.85}
					onPress={() =>
						navigation.reset({
							index: 0,
							routes: [{ name: "home" }],
						})
					}
					className="bg-indigo-600 py-3 rounded-xl"
				>
					<Text className="text-white font-bold text-center">Go to Home</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ErrorPage;
