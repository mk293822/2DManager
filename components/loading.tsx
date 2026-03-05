import { ActivityIndicator, View } from "react-native";

export const Loading = () => {
	return (
		<View className="flex-1 items-center justify-center bg-gray-100 p-4">
			<ActivityIndicator
				size={50}
				color="#2563eb"
			/>
		</View>
	);
};
