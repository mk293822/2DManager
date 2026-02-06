import { useBlink } from "@/hooks/use-blink";
import useFetchLiveTwoD from "@/hooks/use-fetch-live-two-d";
import { getTwoDResultTime } from "@/lib/get-twod-result-time";
import { renderStyledValue } from "@/lib/render-styled-value";
import { formatTimeIntl } from "@/lib/time";
import { TwoDData, TwoDHistoryItem, TwoDResponse } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";

const History = () => {
	const options = ["/history", "11:00:00", "12:01:00", "15:00:00", "16:30:00"];

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(options[0]);

	const currentTime = getTwoDResultTime();
	const { liveData } = useFetchLiveTwoD<TwoDData[]>(value);
	const data = useFetchLiveTwoD<TwoDResponse>();

	const [result, setResult] = useState<TwoDHistoryItem | undefined>();
	const [isResult, setIsResult] = useState<boolean>(true);

	const { style, visible } = useBlink(isResult);

	useEffect(() => {
		if (!data) return;

		// compute result first
		const found = data.liveData?.result.find(
			(d) => d.open_time === currentTime,
		);

		// update state with the computed result
		setResult(found);
		setIsResult(found?.twod !== "--");
	}, [data, currentTime]);

	if (!data.liveData)
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
		<ScrollView className="bg-gray-100">
			{/* HERO RESULT */}
			<View className="items-center pt-10 pb-6">
				<Text
					style={style}
					className="text-[9rem] font-extrabold text-gray-900 tracking-tight"
				>
					{isResult ? result?.twod : data.liveData?.live.twod}
				</Text>

				<View className="flex-row items-center gap-2 mt-2">
					<AntDesign
						name={!visible ? "history" : "check"}
						size={16}
						color={!visible ? "#374151" : "#16a34a"}
					/>
					<Text className="text-sm text-gray-600">
						Updated{" "}
						{isResult ? result?.stock_datetime : data.liveData?.live.time}
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
