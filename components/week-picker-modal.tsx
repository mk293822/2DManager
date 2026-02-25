import { WeekRange } from "@/types/manage-types";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import AppModal from "./ui/app-modal";

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

type Props = {
	visible: boolean;
	initialData: WeekRange;
	onDismiss: () => void;
	onConfirm: (data: WeekRange) => void;
};

export default function WeekPickerModal({
	visible,
	initialData,
	onDismiss,
	onConfirm,
}: Props) {
	const [year, setYear] = useState(initialData.year);
	const [month, setMonth] = useState(initialData.month); // 0–11
	const [week, setWeek] = useState(initialData.week);

	const years = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
	}, []);

	const months = Array.from({ length: 12 }, (_, i) => i);

	const weeksInMonth = useMemo(() => {
		const days = new Date(year, month + 1, 0).getDate();
		return Math.ceil(days / 7);
	}, [year, month]);

	const weeks = Array.from({ length: weeksInMonth }, (_, i) => i + 1);

	const renderColumn = (
		data: number[],
		selected: number,
		setValue: (val: number) => void,
		labelFormatter?: (val: number) => string,
	) => (
		<View style={{ height: PICKER_HEIGHT, width: "100%" }}>
			<FlatList
				data={data}
				keyExtractor={(item) => item.toString()}
				showsVerticalScrollIndicator={false}
				snapToInterval={ITEM_HEIGHT}
				decelerationRate="fast"
				initialScrollIndex={data.indexOf(selected)} // <-- scroll to initial value
				getItemLayout={(_, index) => ({
					length: ITEM_HEIGHT,
					offset: ITEM_HEIGHT * index,
					index,
				})}
				contentContainerStyle={{
					paddingVertical: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
				}}
				onMomentumScrollEnd={(e) => {
					const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
					if (data[index] !== undefined) setValue(data[index]);
				}}
				renderItem={({ item }) => {
					const isSelected = selected === item;
					return (
						<View
							style={{
								height: ITEM_HEIGHT,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text
								className={`text-base ${
									isSelected ? "text-indigo-600 font-bold" : "text-gray-400"
								}`}
							>
								{labelFormatter ? labelFormatter(item) : item}
							</Text>
						</View>
					);
				}}
			/>

			{/* Center highlight */}
			<View
				pointerEvents="none"
				style={{
					position: "absolute",
					top: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
					left: 0,
					right: 0,
					height: ITEM_HEIGHT,
					borderTopWidth: 1,
					borderBottomWidth: 1,
					borderColor: "#E5E7EB",
				}}
			/>
		</View>
	);

	return (
		<AppModal open={visible}>
			<View className="flex-1 justify-center items-center w-11/12">
				<View className="bg-white rounded-3xl px-4 py-8 w-full max-w-md">
					<Text className="text-center text-gray-800 font-semibold text-xl mb-6">
						Select Week {weeksInMonth} {month}
					</Text>

					<View className="flex-row justify-between">
						<View className="flex-1 items-center">
							{renderColumn(years, year, setYear)}
						</View>
						<View className="flex-1 items-center">
							{renderColumn(months, month, setMonth, (m) =>
								new Date(0, m + 1).toLocaleString("default", {
									month: "short",
								}),
							)}
						</View>
						<View className="flex-1 items-center">
							{renderColumn(weeks, week, setWeek)}
						</View>
					</View>

					<View className="flex-row justify-end mt-6 gap-2">
						<Pressable
							onPress={onDismiss}
							className="px-4 py-2 bg-gray-400/60 rounded-xl"
						>
							<Text className="text-white font-semibold">Cancel</Text>
						</Pressable>

						<Pressable
							onPress={() => onConfirm({ type: "week", year, month, week })}
							className="bg-indigo-600 px-6 py-2 rounded-xl"
						>
							<Text className="text-white font-semibold">Confirm</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</AppModal>
	);
}
