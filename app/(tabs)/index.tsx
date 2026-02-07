import HolidayInfo from "@/components/holiday-info";
import LiveCard from "@/components/live-card";
import TwoDResultCard from "@/components/two-d-result-card";
import { useBlink } from "@/hooks/use-blink";
import useFetchLiveTwoD from "@/hooks/use-fetch-live-two-d";
import { getTwoDResultTime } from "@/lib/get-twod-result-time";
import { TwoDHistoryItem } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Index() {
	const { liveData } = useFetchLiveTwoD();
	// eslint-disable-next-line eqeqeq
	const isHoliday = liveData?.holiday?.status == 3;

	const currentTime = getTwoDResultTime(isHoliday);
	const [result, setResult] = useState<TwoDHistoryItem | undefined>();
	const [isResult, setIsResult] = useState<boolean>(true);
	const { style } = useBlink(isResult);

	useEffect(() => {
		if (!liveData) return;

		// compute result first
		const found = liveData.result.find((d) => d.open_time === currentTime);

		// update state with the computed result
		setResult(found);
		setIsResult(found?.twod !== "--");
	}, [liveData, currentTime]);

	// console.info(liveData?.live.time.split(" ")[1]);

	if (!liveData)
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator
					size={50}
					color={"#0000ff"}
					className="my-3"
				/>
			</View>
		);

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: "center",
				justifyContent: "center",
				paddingBottom: 100,
			}}
		>
			{isHoliday && <HolidayInfo />}

			<Text
				className="text-[10rem] font-extrabold font-serif shadow-lg"
				style={style}
			>
				{isResult ? result?.twod : liveData?.live.twod}
			</Text>

			<View className="flex-row gap-2 -mt-4 items-center justify-center">
				<AntDesign
					name={isResult ? "check" : "history"}
					size={20}
					color={isResult ? "#16a34a" : "#1f2937"}
				/>
				<Text>Updated</Text>
				<Text>{isResult ? result?.stock_datetime : liveData?.live.time}</Text>
			</View>

			<View className="flex-col gap-4 py-4 w-full items-center">
				{!isResult && (
					<LiveCard
						liveData={liveData}
						style={style}
						data={result}
						isLive={!isResult}
					/>
				)}

				{liveData?.result
					.filter((d) =>
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
			</View>
		</ScrollView>
	);
}
