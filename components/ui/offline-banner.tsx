import { useInternet } from "@/hooks/use-internet";
import { Text, View } from "react-native";

const OfflineBanner = () => {
	const isConnected = useInternet();

	if (isConnected !== false) return null;

	return (
		<View className="bg-gray-100 border-b border-gray-200 py-1 items-center justify-center">
			<Text className="text-indigo-600 text-sm font-medium">
				No internet connection
			</Text>
		</View>
	);
};

export default OfflineBanner;
