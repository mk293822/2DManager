import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-white px-6">
			{/* 404 */}
			<Text className="text-[80px] font-extrabold text-indigo-600">404</Text>

			{/* Title */}
			<Text className="text-xl font-semibold text-gray-800 mt-2">
				Page Not Found
			</Text>

			{/* Description */}
			<Text className="text-gray-500 text-center mt-2">
				This screen doesn’t exist.
			</Text>

			{/* Go Home */}
			<Link
				href="/"
				asChild
			>
				<TouchableOpacity
					className="mt-6 bg-indigo-600 px-6 py-3 rounded-xl"
					activeOpacity={0.8}
				>
					<Text className="text-white font-semibold">Go Home</Text>
				</TouchableOpacity>
			</Link>
		</View>
	);
}
