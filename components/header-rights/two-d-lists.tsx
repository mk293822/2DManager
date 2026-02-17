import React from "react";
import { Text, View } from "react-native";

const TwoDListsHeaderRight = () => {
	const now = new Date();

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingRight: 16,
				gap: 8, // for spacing between items, supported in modern RN
			}}
		>
			<Text
				style={{
					color: "#D1D5DB", // text-gray-300
					fontSize: 18,
					fontWeight: "500",
				}}
			>
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
