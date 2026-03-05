import { Text, View } from "react-native";

export const SectinDetailRow = ({
	label,
	value,
}: {
	label: string;
	value: string;
}) => {
	return (
		<View className="flex-row justify-between py-2 border-b border-gray-100">
			<Text className="text-gray-600">{label}</Text>
			<Text className="font-semibold">{value}</Text>
		</View>
	);
};
