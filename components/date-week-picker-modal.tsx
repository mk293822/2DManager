import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import AppModal from "./ui/app-modal";

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

type Mode = "date" | "week";

type DateValue = {
	type: "date";
	year: number;
	month: number;
	day: number;
};

type WeekValue = {
	type: "week";
	year: number;
	month: number;
	week: number;
};

type Props = {
	visible: boolean;
	mode: Mode; // 🔥 controlled mode
	initialDate?: DateValue;
	initialWeek?: WeekValue;
	onDismiss: () => void;
	onConfirm: (data: DateValue | WeekValue) => void;
};

export default function DateWeekPickerModal({
	visible,
	mode,
	initialDate,
	initialWeek,
	onDismiss,
	onConfirm,
}: Props) {
	const [year, setYear] = useState(
		initialDate?.year || initialWeek?.year || new Date().getFullYear(),
	);
	const [month, setMonth] = useState(
		initialDate?.month || initialWeek?.month || new Date().getMonth(),
	);

	const [day, setDay] = useState(initialDate?.day || 1);
	const [week, setWeek] = useState(initialWeek?.week || 1);

	const years = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);
	}, []);

	const months = Array.from({ length: 12 }, (_, i) => i);

	const daysInMonth = useMemo(() => {
		return new Date(year, month + 1, 0).getDate();
	}, [year, month]);

	const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

	const weeksInMonth = useMemo(() => {
		return Math.ceil(daysInMonth / 7);
	}, [daysInMonth]);

	const weeks = Array.from({ length: weeksInMonth }, (_, i) => i + 1);

	// Fix overflow
	if (day > daysInMonth) setDay(daysInMonth);
	if (week > weeksInMonth) setWeek(weeksInMonth);

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
				initialScrollIndex={Math.max(0, data.indexOf(selected))}
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
						{mode === "date" ? "Select Date" : "Select Week"}
					</Text>

					<View className="flex-row justify-between">
						<View className="flex-1 items-center">
							{renderColumn(years, year, setYear)}
						</View>

						<View className="flex-1 items-center">
							{renderColumn(months, month, setMonth, (m) =>
								new Date(0, m).toLocaleString("default", {
									month: "short",
								}),
							)}
						</View>

						<View className="flex-1 items-center">
							{mode === "date"
								? renderColumn(days, day, setDay)
								: renderColumn(weeks, week, setWeek)}
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
							onPress={() => {
								if (mode === "date") {
									onConfirm({
										type: "date",
										year,
										month,
										day,
									});
								} else {
									onConfirm({
										type: "week",
										year,
										month,
										week,
									});
								}
							}}
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
