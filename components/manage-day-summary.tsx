import {
	changeSectionName,
	formatDateDisplay,
	formatKs,
	getTotalArray,
} from "@/lib/helpers";
import {
	Section,
	SectionSummaries,
	SectionSummary,
} from "@/types/manage-types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const SummaryCard = ({
	summary,
	selectedDate,
}: {
	summary: SectionSummaries["summary"];
	selectedDate: Date;
}) => (
	<View className="bg-white rounded-2xl shadow p-6 mb-6">
		<Text className="text-indigo-700 font-extrabold text-2xl mb-1">
			Summary
		</Text>
		<Text className="text-gray-500 mb-4">
			{formatDateDisplay(selectedDate)}
		</Text>

		{getTotalArray(summary).map(([label, value]) => (
			<View
				key={label}
				className="flex-row justify-between py-2 border-b border-gray-100"
			>
				<Text className="text-gray-600">{label}</Text>
				<Text className="font-semibold">{formatKs(value)}</Text>
			</View>
		))}

		<View className="flex-row justify-between pt-3">
			<Text className="font-semibold">Profit / Loss</Text>
			<Text
				className={`font-extrabold ${summary.profit_or_loss >= 0 ? "text-green-500" : "text-red-500"}`}
			>
				{formatKs(summary.profit_or_loss)}
			</Text>
		</View>
	</View>
);

const SectionCard = ({
	section,
	data,
	handleCreateSection,
}: {
	section: Section;
	data: SectionSummary | undefined;
	handleCreateSection: (section: Section) => void;
}) => {
	if (!data) {
		return (
			<View className="bg-white rounded-2xl shadow p-6 mb-6 items-center">
				<Text className="text-gray-400 font-extrabold text-xl mb-2">
					No Data for {changeSectionName(section)} section!
				</Text>
				<Text className="text-gray-500 text-sm text-center mb-4">
					This session has no records yet.
				</Text>
				<TouchableOpacity
					activeOpacity={0.85}
					onPress={() => handleCreateSection(section)}
					className="bg-indigo-600 px-6 py-3 rounded-xl shadow"
				>
					<Text className="text-white font-bold">Create Section</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View className="bg-white rounded-2xl shadow p-6 mb-6">
			<Text className="text-indigo-700 font-extrabold text-xl mb-4">
				{changeSectionName(data.section)}
			</Text>
			{getTotalArray(data).map(([label, value]) => (
				<View
					key={label}
					className="flex-row justify-between py-2 border-b border-gray-100"
				>
					<Text className="text-gray-600">{label}</Text>
					<Text className="font-semibold">{formatKs(value)}</Text>
				</View>
			))}
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Draw Number</Text>
				<Text className="font-extrabold text-indigo-700">
					{data.draw_number ?? "--"}
				</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Draw Times</Text>
				<Text className="font-extrabold text-red-700">
					&times; {data.draw_times}
				</Text>
			</View>
			<View className="flex-row justify-between pt-3">
				<Text className="font-semibold">Profit / Loss {data.date}</Text>
				<Text
					className={`font-extrabold ${data.profit_or_loss >= 0 ? "text-green-500" : "text-red-500"}`}
				>
					{formatKs(data.profit_or_loss)}
				</Text>
			</View>
		</View>
	);
};

const ManageDaySummary = ({
	sections,
	selectedDate,
	handleCreateSection,
}: {
	sections: SectionSummaries;
	selectedDate: Date;
	handleCreateSection: (section: Section) => void;
}) => {
	if (!sections) return null;

	const sectionList: Section[] = ["morning_section", "evening_section"];

	return (
		<>
			<SummaryCard
				summary={sections.summary}
				selectedDate={selectedDate}
			/>
			{sectionList.map((sec) => (
				<SectionCard
					key={sec}
					section={sec}
					data={sections[sec]}
					handleCreateSection={handleCreateSection}
				/>
			))}
		</>
	);
};

export default ManageDaySummary;
