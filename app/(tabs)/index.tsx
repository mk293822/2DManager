import HomePageHeaderRight from "@/components/header-rights/home-page";
import HolidayInfo from "@/components/holiday-info";
import LiveCard from "@/components/live-card";
import { Loading } from "@/components/loading";
import TwoDResultCard from "@/components/two-d-lists/two-d-result-card";
import { useBlink } from "@/hooks/use-blink";
import useFetchLiveTwoD from "@/hooks/use-fetch-live-two-d";
import { getTwoDResultTime, toSeconds } from "@/lib/get-twod-result-time";
import { TwoDHistoryItem } from "@/types/two-d-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Index() {
	const { liveData } = useFetchLiveTwoD();
	// eslint-disable-next-line eqeqeq
	const isHoliday = liveData?.holiday?.status == 3;

	const currentTime = getTwoDResultTime(isHoliday);
	const [mainResult, setMainResult] = useState<TwoDHistoryItem | undefined>();
	const [isBlinking, setIsBlinking] = useState<boolean>(false);
	const [showLiveCard, setShowLiveCard] = useState<boolean>(false);
	const { style } = useBlink(isBlinking);
	const router = useRouter();

	useEffect(() => {
		if (!liveData) return;
		if (liveData.result === undefined) {
			router.replace("/error-page");
			return;
		}

		setShowLiveCard(
			!liveData.result.some(
				(d) => d.open_time === "16:30:00" && d.twod !== "--",
			),
		);
		const date = new Date();
		const m_Result = liveData.result.find(
			(d) =>
				(toSeconds(
					liveData.live.time !== "--"
						? liveData.live.time.split(" ")[1]
						: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds}`,
				) < toSeconds("13:00:00")
					? (d.open_time === "12:00:00" ? "12:01:00" : d.open_time) ===
						"12:01:00"
					: d.open_time === "16:30:00") &&
				d.history_id &&
				d.twod !== "--",
		);

		setMainResult(m_Result);
		setIsBlinking(!m_Result);
	}, [liveData, router]);

	return (
		<>
			<Tabs.Screen
				options={{
					headerRight: () => <HomePageHeaderRight />,
				}}
			/>

			{!liveData ? (
				<Loading />
			) : (
				<View className="flex-1 bg-gray-100 px-2">
					<ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
						{isHoliday && <HolidayInfo />}

						{/* Main 2D Result */}
						<View className="w-[95%] bg-white rounded-2xl shadow-md p-4 my-4 self-center">
							<Text
								className="text-9xl font-extrabold text-indigo-700 p-4 text-center"
								style={style}
							>
								{isBlinking ? liveData.live?.twod : mainResult?.twod}
							</Text>
							<View className="flex-row justify-center items-center mt-2">
								<AntDesign
									name={isBlinking ? "history" : "check"}
									size={20}
									color={isBlinking ? "#6b7280" : "#16a34a"}
								/>
								<Text className="ml-2 text-gray-600 font-semibold">
									Updated:
								</Text>
								<Text className="ml-1 text-green-600 font-semibold">
									{isBlinking
										? liveData.live?.time
										: mainResult?.stock_datetime}
								</Text>
							</View>
						</View>

						{/* LiveCard */}
						{showLiveCard && (
							<LiveCard
								liveData={liveData}
								style={style}
								data={mainResult}
								isLive={isBlinking}
								currentTime={currentTime}
							/>
						)}

						{/* 2D Result Cards */}
						{liveData?.result
							?.filter((d) =>
								!showLiveCard
									? d
									: (d.open_time === "12:00:00" ? "12:01:00" : d.open_time) !==
										currentTime,
							)
							.map((data, index) => (
								<TwoDResultCard
									key={index}
									data={data}
								/>
							))}
					</ScrollView>
				</View>
			)}
		</>
	);
}
