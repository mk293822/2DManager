import { useBlink } from "@/hooks/use-blink";
import useFetchLiveTwoD from "@/hooks/use-fetch-live-two-d";
import { renderStyledValue } from "@/lib/render-styled-value";
import { formatTimeIntl } from "@/lib/time";
import { TwoDData, TwoDResponse } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

const History = () => {
	const options = ["/history", "11:00:00", "12:01:00", "15:00:00", "16:30:00"];

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(options[0]);
	const { liveData } = useFetchLiveTwoD<TwoDData[]>(value);
	const data = useFetchLiveTwoD<TwoDResponse>();
	const { style, visible } = useBlink();

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: "center",
			}}
		>
			<Text
				style={style}
				className="text-[10rem] font-extrabold font-serif shadow-lg"
			>
				{data.liveData?.live.twod}
			</Text>
			<View className="flex-row gap-2 -mt-4 items-center justify-center">
				<AntDesign
					name={visible ? "history" : "check"}
					size={20}
					color={visible ? "#1f2937" : "#16a34a"}
				/>
				<Text>Updated</Text>
				<Text>{data.liveData?.live.time}</Text>
			</View>

			<View className="flex-col p-4 w-full">
				<View className="flex-row justify-between items-center">
					<Text className="text-xl font-bold">Last 100 updated list</Text>
					<Pressable
						onPress={() => setOpen(true)}
						className="border rounded p-3 flex-row justify-between items-center w-40"
					>
						<Text>
							{value === options[0]
								? "Live"
								: formatTimeIntl(value.split("=")[1])}
						</Text>
						<AntDesign name="down" />
					</Pressable>

					<Modal
						transparent
						visible={open}
						animationType="fade"
					>
						<Pressable
							className="flex-1 bg-black/40 justify-center items-center"
							onPress={() => setOpen(false)}
						>
							<View className="bg-gray-400 rounded-xl w-64 p-4 flex-col gap-2">
								{options.map((item) => (
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
									>
										<Text
											className={`${value === item ? "bg-gray-500 text-gray-200" : "bg-gray-300"} p-2 rounded-lg`}
										>
											{item === options[0] ? "Live" : formatTimeIntl(item)}
										</Text>
									</Pressable>
								))}
							</View>
						</Pressable>
					</Modal>
				</View>
				<View className="p-4">
					{liveData ? (
						liveData?.map((data, index) => (
							<View key={index}>
								{/* Header */}
								<View className="flex-row py-2 border-b border-gray-300">
									<Text className="w-1/4 font-semibold text-sm text-gray-600">
										{data.date}
									</Text>
									<Text className="w-1/4 font-semibold text-sm text-gray-600 text-center">
										Set
									</Text>
									<Text className="w-1/4 font-semibold text-sm text-gray-600 text-center">
										Value
									</Text>
									<Text className="w-1/4 font-semibold text-sm text-gray-600 text-right">
										2D
									</Text>
								</View>

								{/* Rows */}

								{data.child && data.child.length > 0 ? (
									data.child.map((ch, idx) => (
										<View
											key={idx}
											className="flex-row py-2 border-b border-gray-100"
										>
											<Text className="w-1/4 text-gray-800 font-semibold">
												{ch.time}
											</Text>
											<Text className="w-1/4 text-right text-gray-800">
												{ch.set}
											</Text>
											<Text className="w-1/4 text-right text-gray-800">
												{renderStyledValue(ch.value)}
											</Text>
											<Text className="w-1/4 text-right font-semibold text-amber-500">
												{ch.twod}
											</Text>
										</View>
									))
								) : (
									<View className="justify-center items-center my-20">
										<Text className="font-sans text-3xl font-bold text-gray-400">
											No Data
										</Text>
									</View>
								)}
							</View>
						))
					) : (
						<View className="justify-center items-center my-20">
							<Text className="font-sans text-3xl font-bold text-gray-400">
								No Data
							</Text>
						</View>
					)}
				</View>
			</View>
		</ScrollView>
	);
};

export default History;
