import React from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Manage = () => {
	return (
		<SafeAreaView className="flex-1">
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					alignItems: "center",
					justifyContent: "center",
					paddingVertical: 16,
					paddingBottom: 70,
				}}
			>
				<Text className="text-[10rem] font-extrabold font-serif shadow-lg">
					hello{" "}
				</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Manage;
