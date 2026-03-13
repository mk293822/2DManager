import { ActivityIndicator, Text, View } from "react-native";

export const Loading = () => {
	return (
		<View className="flex-1 items-center justify-center bg-gray-100 p-4">
			<ActivityIndicator
				size={50}
				color="#2563eb"
			/>
			<Text className="font-semibold mt-1">Lodaing...</Text>
		</View>
	);
};
