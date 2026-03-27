// components/DateWeekPickerModal.tsx
import { getWeeksForYear, Week } from "@/lib/datetime-helper";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import AppModal from "./ui/app-modal";

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

type Mode = "date" | "week";

export type DateValue = {
	type: "date";
	year: number;
	month: number;
	day: number;
};

export type WeekValue = {
	type: "week";
	start_date: Date;
	end_date: Date;
};

export type Props = {
	visible: boolean;
	mode: Mode;
	initialDate?: DateValue;
	initialWeek?: WeekValue;
	onDismiss: () => void;
	onConfirm: (data: DateValue | WeekValue) => void;
};

// Helper to get week index from a date (1-based, Monday as first day)
function getWeekIndex(date: Date, weeksOfYear: Week[]): number {
	const weekStart = new Date(date);
	weekStart.setHours(0, 0, 0, 0);

	const index = weeksOfYear.findIndex((week) => {
		const start = new Date(week.start);
		start.setHours(0, 0, 0, 0);
		const end = new Date(week.end);
		end.setHours(23, 59, 59, 999);
		return weekStart >= start && weekStart <= end;
	});

	return index + 1; // 1-based index
}

// Helper to get week by index
function getWeekByIndex(index: number, weeksOfYear: Week[]): WeekValue | null {
	if (index < 1 || index > weeksOfYear.length) return null;
	const week = weeksOfYear[index - 1];
	return {
		type: "week",
		start_date: week.start,
		end_date: week.end,
	};
}

export default function DateWeekPickerModal({
	visible,
	mode,
	initialDate,
	initialWeek,
	onDismiss,
	onConfirm,
}: Props) {
	const [year, setYear] = useState(
		initialDate?.year ||
			initialWeek?.start_date?.getFullYear() ||
			new Date().getFullYear(),
	);
	const [month, setMonth] = useState(initialDate?.month || 0);
	const [day, setDay] = useState(initialDate?.day || 1);
	const [selectedWeek, setSelectedWeek] = useState<WeekValue | null>(
		initialWeek || null,
	);

	// Years
	const years = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);
	}, []);

	// Months
	const months = Array.from({ length: 12 }, (_, i) => i);

	// Days for selected month
	const daysInMonth = useMemo(
		() => new Date(year, month + 1, 0).getDate(),
		[year, month],
	);
	const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

	// Weeks for selected year
	const weeksList = useMemo(() => getWeeksForYear(year), [year]);

	// Get current week index based on selectedWeek
	const currentWeekIndex = useMemo(() => {
		if (selectedWeek) {
			return getWeekIndex(selectedWeek.start_date, weeksList);
		}
		// Default to current week if no selection
		const today = new Date();
		if (today.getFullYear() === year) {
			return getWeekIndex(today, weeksList);
		}
		return 1;
	}, [selectedWeek, weeksList, year]);

	const [weekIndex, setWeekIndex] = useState(currentWeekIndex);

	// Fix overflows
	useEffect(() => {
		if (day > daysInMonth) setDay(daysInMonth);
	}, [day, daysInMonth]);

	useEffect(() => {
		if (weekIndex > weeksList.length) setWeekIndex(weeksList.length);
		if (weekIndex < 1) setWeekIndex(1);
	}, [weekIndex, weeksList.length]);

	// Update selected week when weekIndex or year changes
	useEffect(() => {
		const week = getWeekByIndex(weekIndex, weeksList);
		setSelectedWeek(week);
	}, [weekIndex, weeksList, year]);

	// Update weekIndex when selectedWeek changes externally
	useEffect(() => {
		if (initialWeek && initialWeek.start_date) {
			const index = getWeekIndex(initialWeek.start_date, weeksList);
			setWeekIndex(index);
		}
	}, [initialWeek, weeksList]);

	// -------------------
	// FlatList Column Renderer
	// -------------------
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

	const renderWeekColumn = () =>
		renderColumn(
			Array.from({ length: weeksList.length }, (_, i) => i + 1),
			weekIndex,
			setWeekIndex,
			(i) => {
				const week = weeksList[i - 1];
				if (!week) return `Week ${i}`;
				const startLabel = week.start.toLocaleDateString("default", {
					day: "numeric",
					month: "short",
				});
				const endLabel = week.end.toLocaleDateString("default", {
					day: "numeric",
					month: "short",
				});
				return `Week ${i}: ${startLabel} – ${endLabel}`;
			},
		);

	const renderDateColumns = () => (
		<View className="flex-row justify-between">
			<View className="flex-1 items-center">
				{renderColumn(years, year, setYear)}
			</View>
			<View className="flex-1 items-center">
				{renderColumn(months, month, setMonth, (m) =>
					new Date(0, m).toLocaleString("default", { month: "short" }),
				)}
			</View>
			<View className="flex-1 items-center">
				{renderColumn(days, day, setDay)}
			</View>
		</View>
	);

	const renderWeekPicker = () => (
		<View className="flex-row justify-between">
			<View className="flex-[1] items-center">
				{renderColumn(years, year, setYear)}
			</View>
			<View className="flex-[2] items-center">{renderWeekColumn()}</View>
		</View>
	);

	// -------------------
	// Render
	// -------------------
	return (
		<AppModal open={visible}>
			<View className="flex-1 justify-center items-center w-11/12">
				<View className="bg-white rounded-3xl px-4 py-8 w-full max-w-md">
					<Text className="text-center text-gray-800 font-semibold text-xl mb-6">
						{mode === "date" ? "Select Date" : "Select Week"}
					</Text>

					{mode === "date" ? renderDateColumns() : renderWeekPicker()}

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
									onConfirm({ type: "date", year, month, day });
								} else if (selectedWeek) {
									onConfirm(selectedWeek);
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
