import { getTwoDResultTime } from "@/lib/get-twod-result-time";
import { formatTimeIntl } from "@/lib/time";
import { TwoDHistoryItem, TwoDResponse } from "@/types";
import { Text, View } from "react-native";

const LiveCard = ({
	data,
	isLive = false,
	liveData,
	style,
}: {
	data?: TwoDHistoryItem;
	isLive?: boolean;
	liveData: TwoDResponse | null;
	style: { opacity: number };
}) => {
	const currentTime = getTwoDResultTime();

	const content = isLive ? liveData?.live : data;
	const displayTime = isLive
		? currentTime
		: data && "open_time" in data
			? data.open_time
			: currentTime;

	if (!content) return null;

	return (
		<View className="flex-col w-[90%] p-4 items-center bg-gray-600 rounded-2xl">
			<Text className="text-white font-bold text-3xl w-full text-center">
				{formatTimeIntl(displayTime)}
			</Text>

			<View className="flex-row w-full justify-between mt-4 border-t-2 border-gray-300 pt-4">
				<View className="flex-1 items-center">
					<Text className="text-white/80 font-semibold text-xl">Set</Text>
					<Text className="text-white font-bold text-xl">{content.set}</Text>
				</View>

				<View className="flex-1 items-center">
					<Text className="text-white/80 font-semibold text-xl">Value</Text>
					<Text className="text-white font-bold text-xl">{content.value}</Text>
				</View>

				<View className="flex-1 items-center">
					<Text className="text-white/80 font-semibold text-xl">2D</Text>
					<Text
						className="text-white font-bold text-xl"
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
