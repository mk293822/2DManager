import React from "react";
import { Text, View } from "react-native";

const HolidayInfo = () => {
	return (
		<View className="mt-4 mx-auto bg-amber-100 border border-amber-300 rounded-xl w-[90%] px-4 w- py-3">
			<Text className="text-amber-800 font-bold text-center text-base">
				📌 Market Closed Today
			</Text>
			<Text className="text-amber-700 text-center text-sm mt-1">
				2D results will resume on the next trading day
			</Text>
		</View>
	);
};

export default HolidayInfo;
