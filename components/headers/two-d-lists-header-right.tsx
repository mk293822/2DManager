import React from "react";
import { Text, View } from "react-native";

const TwoDListsHeaderRight = () => {
	const now = new Date();
	return (
		<View className="flex-row gap-2 pr-4 items-center">
			<Text className="text-gray-300 text-xl font-medium">
				{now.toLocaleDateString(undefined, {
					weekday: "short",
					month: "short",
					day: "numeric",
				})}
			</Text>
		</View>
	);
};

export default TwoDListsHeaderRight;
