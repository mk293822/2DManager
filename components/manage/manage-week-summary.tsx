import { formatDateDisplay } from "@/lib/datetime-helper";
import {
	RangeMode,
	SectionRange,
	SectionSummaries,
} from "@/types/manage-types";
import React from "react";
import { Pressable, Text, View } from "react-native";
import SummaryCard from "./summary-card";

/* ===== Week Summary ===== */
const ManageWeekSummary = ({
	section,
	setSelectedSectionRange,
	setRangeMode,
}: {
	section: SectionSummaries;
	setSelectedSectionRange: React.Dispatch<React.SetStateAction<SectionRange>>;
	setRangeMode: React.Dispatch<React.SetStateAction<RangeMode>>;
}) => {
	const { summary, morning_section, evening_section } = section;
	const date = new Date(section.date);
	const handleToggle = () => {
		setRangeMode("day");
		setSelectedSectionRange({
			type: "day",
			date: date,
		});
	};

	return (
		<>
			{!morning_section && !evening_section ? (
				<Pressable onPress={handleToggle}>
					{({ pressed }) => (
						<View
							className={`bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow ${
								pressed ? "opacity-70 scale-95" : ""
							}`}
						>
							<View className="flex-row justify-between items-center">
								<Text className="text-gray-500 font-medium">
									No section for {formatDateDisplay(date)}
								</Text>

								<Text className="text-blue-500 text-sm font-semibold">
									View
								</Text>
							</View>
						</View>
					)}
				</Pressable>
			) : (
				<SummaryCard
					type="day"
					summary={summary}
					date={section.date}
					handleToggle={handleToggle}
					showDetailsBtn
				/>
			)}
		</>
	);
};

export default ManageWeekSummary;
