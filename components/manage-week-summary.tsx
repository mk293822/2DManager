import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import { formatDateDisplay, formatKs, getTotalArray } from "@/lib/helpers";
import { Section, SectionName, SectionSummaries } from "@/types/manage-types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

/* ===== Single SectionName Card ===== */
const SectionCard = ({
	name,
	data,
	date,
}: {
	name: string;
	data: Section | null;
	date: string;
}) => {
	if (!data) {
		return (
			<View className="bg-gray-100 rounded-xl p-3 mb-4">
				<Text className="text-gray-500 font-medium">
					No {name} section for {formatDateDisplay(new Date(date))}
				</Text>
			</View>
		);
	}

	return (
		<View className="bg-gray-100 rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
			<Text className="font-semibold text-indigo-600 mb-2">{name} Section</Text>

			{getTotalArray(data).map(([label, value]) => (
				<View
					key={label}
					className="flex-row justify-between py-0.5"
				>
					<Text className="text-gray-500">{label}</Text>
					<Text className="font-semibold">{formatKs(value as number)}</Text>
				</View>
			))}

			<View className="flex-row justify-between py-0.5">
				<Text className="text-gray-500">Draw Number</Text>
				<Text className="font-semibold">{data.draw_number ?? "--"}</Text>
			</View>

			<View className="flex-row justify-between py-0.5">
				<Text className="text-gray-500">Draw Times</Text>
				<Text className="font-semibold">&times; {data.draw_times}</Text>
			</View>

			<View className="flex-row justify-between mt-1">
				<Text className="font-semibold">Profit / Loss</Text>
				<Text
					className={`font-bold ${
						data.profit_or_loss >= 0 ? "text-green-600" : "text-red-600"
					}`}
				>
					{formatKs(data.profit_or_loss)}
				</Text>
			</View>
		</View>
	);
};

/* ===== Day Card (Summary + Sections) ===== */
const DayCard = ({
	section,
	handleCreateSection,
}: {
	section: SectionSummaries;
	handleCreateSection: (section: SectionName, date: Date) => void;
}) => {
	const { summary, morning_section, evening_section } = section;
	const date = new Date(summary.date);

	const handleToggle = () => {
		eventBus.emit(EVENT_NAMES.CHANGE_DATE_RANGE, {
			range: "day",
			date,
		});
	};

	if (!morning_section && !evening_section) {
		return (
			<View className="bg-white rounded-2xl p-6 mb-4 items-center shadow">
				<Text className="text-gray-500 font-medium text-center mb-3">
					No sections available for {formatDateDisplay(new Date(summary.date))}
				</Text>

				<Text className="text-gray-400 text-sm text-center mb-4">
					You can create sections for this day below.
				</Text>

				<View className="flex-row gap-3">
					<TouchableOpacity
						activeOpacity={0.85}
						onPress={() => handleCreateSection("morning_section", date)}
						className="bg-indigo-500 px-4 py-3 rounded-xl shadow flex-1 items-center"
					>
						<Text className="text-white font-semibold text-center">
							Create Morning
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.85}
						onPress={() => handleCreateSection("evening_section", date)}
						className="bg-indigo-500 px-4 py-3 rounded-xl shadow flex-1 items-center"
					>
						<Text className="text-white font-semibold text-center">
							Create Evening
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View className="bg-white rounded-3xl p-4 mb-6 shadow-md">
			<View className="flex-row justify-between items-center mb-4 px-1">
				<Text className="text-indigo-600 font-bold text-xl">
					{formatDateDisplay(new Date(summary.date))}
				</Text>
				<TouchableOpacity
					activeOpacity={0.85}
					onPress={handleToggle}
				>
					<Text className="text-indigo-600 underline font-semibold">
						Details
					</Text>
				</TouchableOpacity>
			</View>

			<View className="bg-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
				<Text className="font-semibold text-gray-700 mb-2">Summary</Text>

				{getTotalArray(summary).map(([label, value]) => (
					<View
						key={label}
						className="flex-row justify-between py-1"
					>
						<Text className="text-gray-500">{label}</Text>
						<Text className="font-semibold">{formatKs(value as number)}</Text>
					</View>
				))}

				<View className="flex-row justify-between mt-2">
					<Text className="font-semibold">Profit / Loss</Text>
					<Text
						className={`font-bold ${
							summary.profit_or_loss >= 0 ? "text-green-600" : "text-red-600"
						}`}
					>
						{formatKs(summary.profit_or_loss)}
					</Text>
				</View>
			</View>

			<SectionCard
				name="Morning"
				data={morning_section}
				date={summary.date}
			/>
			<SectionCard
				name="Evening"
				data={evening_section}
				date={summary.date}
			/>
		</View>
	);
};

/* ===== Week Summary ===== */
const ManageWeekSummary = ({
	sections,
	handleCreateSection,
}: {
	sections: SectionSummaries[];
	handleCreateSection: (section: SectionName, date: Date) => void;
}) => {
	if (!sections || sections.length === 0) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 p-6">
				<View className="bg-white rounded-2xl shadow p-6 w-full max-w-sm items-center">
					<Text className="text-gray-500 text-center text-lg mb-4">
						No sections available for this week.
					</Text>

					<Text className="text-gray-400 text-center text-sm mb-6">
						It looks like there are no records yet.
					</Text>
				</View>
			</View>
		);
	}

	return (
		<>
			{sections.map((s, idx) => (
				<DayCard
					key={idx}
					section={s}
					handleCreateSection={handleCreateSection}
				/>
			))}
		</>
	);
};

export default ManageWeekSummary;
