import { formatDateDisplay, formatKs } from "@/lib/helpers";
import {
	Section,
	SectionSummaries,
	SectionSummary,
} from "@/types/manage-types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

/* ================= COMPONENT ================= */

const ManageDaySummary = ({
	sections,
	selectedDate,
}: {
	sections: SectionSummaries | undefined;
	selectedDate: Date;
}) => {
	const changeSectionName = (section: Section) => {
		if (section === "morning_section") return "Morning";
		else return "Evening";
	};

	const sectionList: { key: Section; data: SectionSummary | undefined }[] = [
		{ key: "morning_section", data: sections?.morning },
		{ key: "evening_section", data: sections?.evening },
	];

	return (
		sections && (
			<>
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
						["Total Sold", sections.summary.total_amount],
						["Total Resold", sections.summary.total_resold],
						["Total Commission", sections.summary.total_commission],
						["Total Draw Amount", sections.summary.draw_total_amount],
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
							className={`font-extrabold ${sections?.summary?.profit_or_loss >= 0 ? "text-green-500" : "text-red-500"}`}
						>
							{formatKs(sections.summary.profit_or_loss)}
						</Text>
					</View>
				</View>

				{/* ===== SESSION CARDS ===== */}
				{sectionList.map(({ key, data }) =>
					data ? (
						<View
							key={data.id}
							className="bg-white rounded-2xl shadow p-6 mb-6"
						>
							<Text className="text-indigo-700 font-extrabold text-xl mb-4">
								{changeSectionName(data.section)}
							</Text>
							{[
								["Total Sold", data.total_amount],
								["Total Resold", data.total_resold],
								["Total Commission", data.total_commission],
								["Total Draw Amount", data.draw_total_amount],
							].map(([label, value]) => (
								<View
									key={label}
									className="flex-row justify-between py-2 border-b border-gray-100"
								>
									<Text className="text-gray-600">{label}</Text>
									<Text className="font-semibold">
										{formatKs(value as number)}
									</Text>
								</View>
							))}
							<View className="flex-row justify-between py-2 border-b border-gray-100">
								<Text className="text-gray-600">Draw Number</Text>
								<Text className="font-extrabold text-indigo-700">
									{data.draw_number}
								</Text>
							</View>
							<View className="flex-row justify-between py-2 border-b border-gray-100">
								<Text className="text-gray-600">Draw Times</Text>
								<Text className="font-extrabold text-red-700">
									&times; {data.draw_times}
								</Text>
							</View>
							<View className="flex-row justify-between pt-3">
								<Text className="font-semibold">Profit / Loss</Text>
								<Text
									className={`font-extrabold ${data.profit_or_loss >= 0 ? "text-green-500" : "text-red-500"}`}
								>
									{formatKs(data.profit_or_loss)}
								</Text>
							</View>
						</View>
					) : (
						<View
							key={key}
							className="bg-white rounded-2xl shadow p-6 mb-6 items-center"
						>
							<Text className="text-gray-400 font-extrabold text-xl mb-2">
								No Data for {changeSectionName(key)} section!
							</Text>

							<Text className="text-gray-500 text-sm text-center mb-4">
								This session has no records yet.{" "}
							</Text>

							<TouchableOpacity
								activeOpacity={0.85}
								onPress={() => {
									// navigate or open modal
									console.log("Create section", key);
								}}
								className="bg-indigo-600 px-6 py-3 rounded-xl shadow"
							>
								<Text className="text-white font-bold">
									Create {changeSectionName(key)} Section
								</Text>
							</TouchableOpacity>
						</View>
					),
				)}
			</>
		)
	);
};

export default ManageDaySummary;
