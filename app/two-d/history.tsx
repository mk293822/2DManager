import HolidayInfo from "@/components/holiday-info";
import { Loading } from "@/components/loading";
import useFetchLiveTwoD from "@/hooks/live-two-d/use-fetch-live-two-d";
import { useBlink } from "@/hooks/use-blink";
import { useInternet } from "@/hooks/use-internet";
import { formatTimeIntl } from "@/lib/datetime-helper";
import { getTwoDResultTime, toSeconds } from "@/lib/get-twod-result-time";
import { renderStyledValue } from "@/lib/render-styled-value";
import { TwoDData, TwoDHistoryItem, TwoDResponse } from "@/types/two-d-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

const History = () => {
	const options = ["/history", "11:00:00", "12:01:00", "15:00:00", "16:30:00"];

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(options[0]);

	const { liveData } = useFetchLiveTwoD<TwoDData[]>(value);
	const data = useFetchLiveTwoD<TwoDResponse>();
	// eslint-disable-next-line eqeqeq
	const isHoliday = data.liveData?.holiday?.status == 3;
	const currentTime = getTwoDResultTime(isHoliday);
	const [mainResult, setMainResult] = useState<TwoDHistoryItem | undefined>();
	const [isBlinking, setIsBlinking] = useState<boolean>(false);
	const { style } = useBlink(isBlinking);
	const isConnected = useInternet();

	useEffect(() => {
		if (!data || !data.liveData) return;
		const date = new Date();
		const m_Result = data.liveData.result.find(
			(d) =>
				(toSeconds(
					data.liveData?.live.time !== "--"
						? (data.liveData?.live.time.split(" ")[1] ?? "00:00:00")
						: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
				) < toSeconds("13:00:00")
					? (d.open_time === "12:00:00" ? "12:01:00" : d.open_time) ===
						"12:01:00"
					: d.open_time === "16:30:00") &&
				d.history_id &&
				d.twod !== "--",
		);

		setMainResult(m_Result);
		setIsBlinking(!m_Result);
	}, [data, currentTime]);

	if (!data.liveData) return <Loading />;

	if (isConnected === false) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 px-6">
				<Text className="text-indigo-600 text-2xl font-bold mb-2 text-center">
					No Internet Connection
				</Text>
				<Text className="text-gray-600 text-center mb-6">
					This page requires an internet connection.
				</Text>
			</View>
		);
	}

	return (
		<ScrollView className="bg-gray-100">
			{isHoliday && <HolidayInfo />}

			{/* HERO RESULT */}
			<View className="items-center pb-6">
				<Text
					style={style}
					className="text-[9rem] font-extrabold text-gray-900 tracking-tight"
				>
					{isBlinking ? data.liveData.live?.twod : mainResult?.twod}
				</Text>

				<View className="flex-row items-center gap-2 mt-2">
					<AntDesign
						name={isBlinking ? "history" : "check"}
						size={16}
						color={isBlinking ? "#6b7280" : "#16a34a"}
					/>
					<Text className="text-sm text-gray-600">
						Updated:{" "}
						{isBlinking
							? data.liveData.live?.time.split(" ")[0]
							: mainResult?.stock_datetime.split(" ")[0]}{" "}
						{formatTimeIntl(
							isBlinking
								? data.liveData.live?.time.split(" ")[1]
								: mainResult?.stock_datetime.split(" ")[1],
							true,
						)}
					</Text>
				</View>
			</View>

			{/* CONTENT */}
			<View className="px-4 pb-10">
				{/* HEADER */}
				<View className="flex-row justify-between items-center mb-4">
					<Text className="text-lg font-bold text-gray-800">
						Last 100 Results
					</Text>

					<Pressable
						onPress={() => setOpen(true)}
						className="flex-row items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200"
					>
						<Text className="text-sm font-medium">
							{value === options[0]
								? "Live"
								: formatTimeIntl(value.split("=")[1])}
						</Text>
						<AntDesign
							name="down"
							size={14}
						/>
					</Pressable>
				</View>

				{/* FILTER MODAL */}
				<Modal
					transparent
					visible={open}
					animationType="fade"
				>
					<Pressable
						className="flex-1 bg-black/40 justify-center items-center"
						onPress={() => setOpen(false)}
					>
						<View className="bg-white rounded-xl w-64 p-3 shadow-xl">
							{options.map((item) => {
								const active =
									value === item || value === `/2d_history?open_time=${item}`;

								return (
									<Pressable
										key={item}
										onPress={() => {
											setValue(
												item === options[0]
													? item
													: `/2d_history?open_time=${item}`,
											);
											setOpen(false);
										}}
										className={`px-3 py-2 rounded-lg ${
											active ? "bg-gray-900" : "bg-gray-100"
										}`}
									>
										<Text
											className={`text-center font-medium ${
												active ? "text-white" : "text-gray-800"
											}`}
										>
											{item === options[0] ? "Live" : formatTimeIntl(item)}
										</Text>
									</Pressable>
								);
							})}
						</View>
					</Pressable>
				</Modal>

				{/* TABLE */}
				<View className="bg-white rounded-xl shadow-sm overflow-hidden">
					{liveData && liveData.length > 0 ? (
						liveData.map((data, index) => (
							<View key={index}>
								{/* DATE HEADER */}
								<View className="bg-gray-50 px-4 py-2 border-b border-gray-200">
									<Text className="text-xs font-semibold text-gray-600">
										{data.date}
									</Text>
								</View>

								{/* ROWS */}
								{data.child?.length ? (
									data.child.map((ch, idx) => (
										<View
											key={idx}
											className="flex-row px-4 py-3 border-b border-gray-100"
										>
											<Text className="w-1/4 text-sm font-medium">
												{ch.time}
											</Text>
											<Text className="w-1/4 text-right text-sm">{ch.set}</Text>
											<Text className="w-1/4 text-right text-sm">
												{renderStyledValue(ch.value)}
											</Text>
											<Text className="w-1/4 text-right text-sm font-bold text-amber-500">
												{ch.twod}
											</Text>
										</View>
									))
								) : (
									<EmptyState />
								)}
							</View>
						))
					) : (
						<EmptyState />
					)}
				</View>
			</View>
		</ScrollView>
	);
};

export default History;

/* ------------------ helpers ------------------ */

const EmptyState = () => (
	<View className="py-16 items-center">
		<Text className="text-2xl font-bold text-gray-400">No Data</Text>
	</View>
);
