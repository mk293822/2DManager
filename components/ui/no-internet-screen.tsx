import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoInternetScreen() {
	return (
		<SafeAreaView className="flex-1 items-center justify-center bg-indigo-600 px-6">
			<View className="items-center bg-indigo-700 rounded-2xl p-8 shadow-lg">
				<Image
					source={require("@/assets/images/wifi-off.png")} // make sure extension is correct
					className="w-24 h-24 mb-6"
					resizeMode="contain"
				/>
				<Text className="text-3xl font-extrabold text-white mb-2 text-center">
					No Internet
				</Text>
				<Text className="text-white text-center text-base mb-6">
					It seems your connection is lost. Please check your WiFi or mobile
					data.
				</Text>
			</View>
		</SafeAreaView>
	);
}
