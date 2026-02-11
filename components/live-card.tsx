import { resultTime } from "@/lib/get-twod-result-time";
import { formatTimeIntl } from "@/lib/helpers";
import { TwoDHistoryItem, TwoDResponse } from "@/types/two-d-types";
import { Text, View } from "react-native";

const LiveCard = ({
	data,
	isLive = false,
	liveData,
	style,
	currentTime,
}: {
	data?: TwoDHistoryItem;
	isLive?: boolean;
	liveData: TwoDResponse | null;
	style: { opacity: number };
	currentTime: resultTime;
}) => {
	const content = isLive ? liveData?.live : data;
	const displayTime = isLive
		? currentTime
		: data && "open_time" in data
			? data.open_time
			: currentTime;

	if (!content) return null;

	return (
		<View className="flex-col w-[95%] p-4 mb-4 bg-white rounded-2xl shadow-md self-center">
			{/* Time */}
			<Text className="text-indigo-700 font-extrabold text-3xl w-full text-center">
				{formatTimeIntl(displayTime)}
			</Text>

			{/* Row */}
			<View className="flex-row w-full justify-between mt-4 border-t border-gray-200 pt-4">
				<View className="flex-1 items-center">
					<Text className="text-gray-400 font-semibold text-xl">Set</Text>
					<Text className="text-indigo-700 font-bold text-xl">
						{content.set}
					</Text>
				</View>

				<View className="flex-1 items-center">
					<Text className="text-gray-400 font-semibold text-xl">Value</Text>
					<Text className="text-green-600 font-bold text-xl">
						{content.value}
					</Text>
				</View>

				<View className="flex-1 items-center">
					<Text className="text-gray-400 font-semibold text-xl">2D</Text>
					<Text
						className="text-indigo-700 font-bold text-xl"
						style={isLive ? style : undefined}
					>
						{content.twod}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default LiveCard;
