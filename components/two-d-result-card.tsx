import { formatTimeIntl } from "@/lib/time";
import { TwoDHistoryItem } from "@/types";
import React from "react";
import { Text, View } from "react-native";

const TwoDResultCard = ({
	data,
	main = true,
}: {
	data: TwoDHistoryItem;
	main: boolean;
}) => {
	return (
		<View
			className={`flex-col w-[90%] p-4 items-center ${main ? "bg-gray-700" : "bg-gray-600"} rounded-2xl`}
		>
			<Text className="text-white font-bold text-3xl w-full text-center">
				{formatTimeIntl(
					data.open_time === "12:00:00" ? "12:01:00" : data.open_time,
				)}
			</Text>

			{/* Row */}
			<View className="flex-row w-full justify-between mt-4 border-t-2 border-gray-300 pt-4">
				<View className="flex-1 items-center">
					<Text className="text-white/80 font-semibold text-xl">Set</Text>
					<Text className="text-white font-bold text-xl">{data?.set}</Text>
				</View>

				<View className="flex-1 items-center">
					<Text className="text-white/80 font-semibold text-xl">value</Text>
					<Text className="text-white font-bold text-xl">{data?.value}</Text>
				</View>

				<View className="flex-1 items-center">
					<Text className="text-white/80 font-semibold text-xl">2D</Text>
					<Text className="text-white font-bold text-xl">{data?.twod}</Text>
				</View>
			</View>
		</View>
	);
};

export default TwoDResultCard;
