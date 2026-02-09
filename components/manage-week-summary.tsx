// components/manage-week-summary.tsx
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
const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

/* ================= HELPERS ================= */
const formatKs = (num: number) => `${num.toLocaleString()} Ks`;

const generateSessionData = (): NumberData[] =>
	Array.from({ length: 100 }).map((_, i) => ({
		number: i.toString().padStart(2, "0"),
		value: Math.floor(Math.random() * 10000),
		resold: Math.floor(Math.random() * 2000),
	}));

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

const generateDayData = (date: Date): DayData => {
	const morning = calculateSessionStats(generateSessionData());
	const evening = calculateSessionStats(generateSessionData());
	return {
		date: date.toDateString(),
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

const getWeekDates = (selected: Date) => {
	const first = selected.getDate() - selected.getDay(); // Sunday
	return Array.from({ length: 7 }).map(
		(_, i) => new Date(selected.getFullYear(), selected.getMonth(), first + i),
	);
};

const formatDateDisplay = (date: Date) => {
	const dayName = DAYS[date.getDay()];
	const month = date.toLocaleString("default", { month: "short" });
	const day = date.getDate();
	const year = date.getFullYear();
	return `${dayName}, ${month} ${day}, ${year}`;
};

/* ================= COMPONENT ================= */

const ManageWeekSummary = () => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);

	registerTranslation("en-GB", enGB);

	const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
	const weekData = useMemo(
		() => weekDates.map((d) => generateDayData(d)),
		[weekDates],
	);

	return (
		<>
			{/* ===== WEEK PICKER ===== */}
			<Pressable
				onPress={() => setShowPicker(true)}
				style={{
					backgroundColor: "white",
					borderWidth: 1,
					borderColor: "#d1d5db",
					borderRadius: 12,
					padding: 12,
					marginBottom: 16,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							backgroundColor: "#e0e7ff",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<AntDesign
							name="calendar"
							size={22}
							color="#4f46e5"
						/>
					</View>
					<View>
						<Text className="text-xs text-gray-500 font-medium">
							Select Week
						</Text>
						<Text style={{ color: "#4f46e5", fontWeight: "600" }}>
							Week of {formatDateDisplay(weekDates[0])}
						</Text>
					</View>
				</View>
				<Text style={{ color: "#4f46e5", fontWeight: "600" }}>Change</Text>
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

			{/* ===== WEEK CARDS ===== */}
			{weekData.map((day) => (
				<View
					key={day.date}
					style={{
						backgroundColor: "white",
						borderRadius: 16,
						padding: 16,
						marginBottom: 16,
						boxShadow: "#000",
						shadowOpacity: 0.1,
						shadowRadius: 5,
						elevation: 3,
					}}
				>
					<Text
						style={{
							color: "#4f46e5",
							fontWeight: "700",
							fontSize: 18,
							marginBottom: 4,
						}}
					>
						{formatDateDisplay(new Date(day.date))}
					</Text>
					<Text style={{ fontWeight: "600", marginBottom: 8 }}>Summary</Text>
					{/* Total summary */}
					{[
						["Total Sold", day.summary.totalSold],
						["Exceed Total", day.summary.exceedTotal],
						["Resold Total", day.summary.resoldTotal],
						["Commission", day.summary.commission],
					].map(([label, value]) => (
						<View
							key={label}
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								paddingVertical: 4,
							}}
						>
							<Text style={{ color: "#6b7280" }}>{label}</Text>
							<Text style={{ fontWeight: "600" }}>
								{formatKs(value as number)}
							</Text>
						</View>
					))}
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginTop: 6,
						}}
					>
						<Text style={{ fontWeight: "600" }}>Profit / Loss</Text>
						<Text
							style={{
								fontWeight: "700",
								color: day.summary.profitLoss >= 0 ? "#16a34a" : "#dc2626",
							}}
						>
							{formatKs(day.summary.profitLoss)}
						</Text>
					</View>

					{/* Morning + Evening */}
					{[
						{ title: "Morning Session", data: day.morning },
						{ title: "Evening Session", data: day.evening },
					].map((session) => (
						<View
							key={session.title}
							style={{ marginTop: 12 }}
						>
							<Text
								style={{
									fontWeight: "600",
									color: "#4f46e5",
									marginBottom: 4,
								}}
							>
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
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										paddingVertical: 2,
									}}
								>
									<Text style={{ color: "#6b7280" }}>{label}</Text>
									<Text style={{ fontWeight: "600" }}>
										{formatKs(value as number)}
									</Text>
								</View>
							))}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									marginTop: 2,
								}}
							>
								<Text style={{ fontWeight: "600" }}>Profit / Loss</Text>
								<Text
									style={{
										fontWeight: "700",
										color: session.data.profitLoss >= 0 ? "#16a34a" : "#dc2626",
									}}
								>
									{formatKs(session.data.profitLoss)}
								</Text>
							</View>
						</View>
					))}
				</View>
			))}
		</>
	);
};

export default ManageWeekSummary;
