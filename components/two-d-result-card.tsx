import { formatTimeIntl } from "@/lib/helpers";
import { TwoDHistoryItem } from "@/types/two-d-types";
import { Text, View } from "react-native";

const TwoDResultCard = ({ data }: { data: TwoDHistoryItem }) => {
	return (
		<View className="flex-col w-[95%] p-4 mb-4 bg-white rounded-2xl shadow-md self-center">
			{/* Time */}
			<Text className="text-indigo-700 font-extrabold text-3xl w-full text-center">
				{formatTimeIntl(
					data.open_time === "12:00:00" ? "12:01:00" : data.open_time,
				)}
			</Text>

			{/* Row */}
			<View className="flex-row w-full justify-between mt-4 border-t border-gray-200 pt-4">
				<View className="flex-1 items-center">
					<Text className="text-gray-400 font-semibold text-xl">Set</Text>
					<Text className="text-indigo-700 font-bold text-xl">{data.set}</Text>
				</View>

				<View className="flex-1 items-center">
					<Text className="text-gray-400 font-semibold text-xl">Value</Text>
					<Text className="text-green-600 font-bold text-xl">{data.value}</Text>
				</View>

				<View className="flex-1 items-center">
					<Text className="text-gray-400 font-semibold text-xl">2D</Text>
					<Text className="text-indigo-700 font-bold text-xl">{data.twod}</Text>
				</View>
			</View>
		</View>
	);
};

export default TwoDResultCard;
