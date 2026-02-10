import HolidayInfo from "@/components/holiday-info";
import LiveCard from "@/components/live-card";
import TwoDResultCard from "@/components/two-d-result-card";
import { useBlink } from "@/hooks/use-blink";
import useFetchLiveTwoD from "@/hooks/use-fetch-live-two-d";
import { getTwoDResultTime } from "@/lib/get-twod-result-time";
import { TwoDHistoryItem } from "@/types/two-d-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Index() {
	const { liveData } = useFetchLiveTwoD();
	// eslint-disable-next-line eqeqeq
	const isHoliday = liveData?.holiday?.status == 3;

	const currentTime = getTwoDResultTime(isHoliday);
	const [result, setResult] = useState<TwoDHistoryItem | undefined>();
	const [isResult, setIsResult] = useState<boolean>(false);
	const { style } = useBlink(isResult);

	useEffect(() => {
		if (!liveData) return;

		const found = liveData.result.find(
			(d) =>
				d.open_time === (currentTime === "12:01:00" ? "12:00:00" : currentTime),
		);

		if (currentTime !== "11:00:00" && currentTime !== "15:00:00") {
			setResult(found);
			setIsResult(found?.twod !== "--");
		} else {
			setResult(undefined);
			setIsResult(false);
		}
	}, [liveData, currentTime]);

	if (!liveData)
		return (
			<View className="flex-1 items-center justify-center bg-gray-100">
				<ActivityIndicator
					size={50}
					color="#2563eb"
				/>
			</View>
		);

	return (
		<View className="flex-1 bg-gray-100">
			<ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
				{isHoliday && <HolidayInfo />}

				{/* Main 2D Result */}
				<View className="w-[95%] bg-white rounded-2xl shadow-md p-4 my-4 self-center">
					<Text
						className="text-9xl font-extrabold text-indigo-700 p-4 text-center"
						style={style}
					>
						{isResult ? result?.twod : liveData.live?.twod}
					</Text>
					<View className="flex-row justify-center items-center mt-2">
						<AntDesign
							name={isResult ? "check" : "history"}
							size={20}
							color={isResult ? "#16a34a" : "#6b7280"}
						/>
						<Text className="ml-2 text-gray-600 font-semibold">Updated:</Text>
						<Text className="ml-1 text-green-600 font-semibold">
							{isResult ? result?.stock_datetime : liveData.live?.time}
						</Text>
					</View>
				</View>

				{/* LiveCard */}
				{!isResult && (
					<LiveCard
						liveData={liveData}
						style={style}
						data={result}
						isLive={!isResult}
					/>
				)}

				{/* 2D Result Cards */}
				{liveData?.result
					?.filter((d) =>
						isResult
							? d
							: d.open_time !==
								(currentTime === "12:01:00" ? "12:00:00" : currentTime),
					)
					.map((data, index) => (
						<TwoDResultCard
							key={index}
							data={data}
							main={["16:30:00", "12:00:00", "12:01:00"].includes(
								data.open_time,
							)}
						/>
					))}
			</ScrollView>
		</View>
	);
}
