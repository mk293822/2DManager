import { DayData, NumberData, SessionStats } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
	DatePickerModal,
	enGB,
	registerTranslation,
} from "react-native-paper-dates";

/* ================= CONSTANTS ================= */

const PER_NUMBER_LIMIT = 1000;
const COMMISSION_RATE = 0.05;
const WINNER_NUMBERS = ["01", "05", "12"];

/* ================= HELPERS ================= */

const formatKs = (num: number) => `${num.toLocaleString()} Ks`;

const generateSessionData = (): NumberData[] => {
	return Array.from({ length: 100 }).map((_, i) => ({
		number: i.toString().padStart(2, "0"),
		value: Math.floor(Math.random() * 10_000),
		resold: Math.floor(Math.random() * 2000),
	}));
};

const calculateSessionStats = (data: NumberData[]): SessionStats => {
	const totalSold = data.reduce((s, i) => s + i.value, 0);
	const exceedTotal = data
		.filter((i) => i.value > PER_NUMBER_LIMIT)
		.reduce((s, i) => s + i.value, 0);
	const resoldTotal = data.reduce((s, i) => s + i.resold, 0);
	const commission = totalSold * COMMISSION_RATE;
	const payoutToWinners = data
		.filter((i) => WINNER_NUMBERS.includes(i.number))
		.reduce((s, i) => s + i.value, 0);

	return {
		totalSold,
		exceedTotal,
		resoldTotal,
		commission,
		payoutToWinners,
		profitLoss: totalSold - (commission + payoutToWinners + resoldTotal),
	};
};

const generateDayData = (label: string): DayData => {
	const morning = calculateSessionStats(generateSessionData());
	const evening = calculateSessionStats(generateSessionData());

	return {
		date: label,
		morning,
		evening,
		summary: {
			totalSold: morning.totalSold + evening.totalSold,
			exceedTotal: morning.exceedTotal + evening.exceedTotal,
			resoldTotal: morning.resoldTotal + evening.resoldTotal,
			commission: morning.commission + evening.commission,
			profitLoss: morning.profitLoss + evening.profitLoss,
		},
	};
};

const DAYS: string[] = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const formatDateDisplay = (date: Date) => {
	const dayName = DAYS[date.getDay()];
	const month = date.toLocaleString("default", { month: "short" });
	const day = date.getDate();
	const year = date.getFullYear();
	return `${dayName}, ${month} ${day}, ${year}`;
};

/* ================= COMPONENT ================= */

const ManageDaySummary = () => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);

	const dayData = useMemo(
		() => generateDayData(selectedDate.toDateString()),
		[selectedDate],
	);

	registerTranslation("en-GB", enGB);

	return (
		<>
			{/* ===== DATE PICKER (CLICKABLE LOOK) ===== */}
			<Pressable
				onPress={() => setShowPicker(true)}
				className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 flex-row items-center justify-between active:opacity-70"
			>
				<View className="flex-row items-center gap-3">
					<View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center">
						<AntDesign
							name="calendar"
							size={22}
							color="#4f46e5"
						/>
					</View>

					<View>
						<Text className="text-xs text-gray-500 font-medium">
							Select date
						</Text>
						<Text className="text-indigo-700 font-semibold">
							{formatDateDisplay(selectedDate)}
						</Text>
					</View>
				</View>

				<Text className="text-indigo-600 text-sm font-semibold">Change</Text>
			</Pressable>

			{showPicker && (
				<DatePickerModal
					locale="en-GB"
					mode="single"
					visible={showPicker}
					date={selectedDate}
					onDismiss={() => setShowPicker(false)}
					onConfirm={({ date }) => {
						setShowPicker(false);
						if (date) setSelectedDate(date);
					}}
					saveLabel="Select"
					animationType="fade"
				/>
			)}

			{/* ===== SUMMARY CARD ===== */}
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<Text className="text-indigo-700 font-extrabold text-2xl mb-1">
					Summary
				</Text>
				<Text className="text-gray-500 mb-4">
					{formatDateDisplay(selectedDate)}
				</Text>
				{/* Total Sold, Exceed, Resold */}
				{[
					["Total Sold", dayData.summary.totalSold],
					["Exceed Total", dayData.summary.exceedTotal],
					["Resold", dayData.summary.resoldTotal],
					["Commission Total", dayData.summary.commission],
				].map(([label, value]) => (
					<View
						key={label}
						className="flex-row justify-between py-2 border-b border-gray-100"
					>
						<Text className="text-gray-600">{label}</Text>
						<Text className="font-semibold">{formatKs(value as number)}</Text>
					</View>
				))}
				<View className="flex-row justify-between pt-3">
					<Text className="font-semibold">Profit / Loss</Text>
					<Text
						className={`font-extrabold ${dayData.summary.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
					>
						{formatKs(dayData.summary.profitLoss)}
					</Text>
				</View>
			</View>

			{/* ===== SESSION CARDS ===== */}
			{[
				{ title: "Morning Session", data: dayData.morning },
				{ title: "Evening Session", data: dayData.evening },
			].map((session) => (
				<View
					key={session.title}
					className="bg-white rounded-2xl shadow p-6 mb-6"
				>
					<Text className="text-indigo-700 font-extrabold text-xl mb-4">
						{session.title}
					</Text>
					{[
						["Total Sold", session.data.totalSold],
						["Exceed Total", session.data.exceedTotal],
						["Resold", session.data.resoldTotal],
						["Commission", session.data.commission],
					].map(([label, value]) => (
						<View
							key={label}
							className="flex-row justify-between py-2 border-b border-gray-100"
						>
							<Text className="text-gray-600">{label}</Text>
							<Text className="font-semibold">{formatKs(value as number)}</Text>
						</View>
					))}
					<View className="flex-row justify-between pt-3">
						<Text className="font-semibold">Profit / Loss</Text>
						<Text
							className={`font-extrabold ${session.data.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
						>
							{formatKs(session.data.profitLoss)}
						</Text>
					</View>
				</View>
			))}
		</>
	);
};

export default ManageDaySummary;
