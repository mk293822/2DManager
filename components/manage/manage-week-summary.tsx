import { formatDateDisplay } from "@/lib/helpers";
import {
	RangeMode,
	SectionName,
	SectionRange,
	SectionSummaries,
} from "@/types/manage-types";
import React from "react";
import { Pressable, Text, View } from "react-native";
import WeekSectionCard from "./week-section-card";
import WeekSummaryCard from "./week-summary-card";

/* ===== Week Summary ===== */
const ManageWeekSummary = ({
	sections,
	setSelectedSectionRange,
	setRangeMode,
}: {
	sections: SectionSummaries[];
	setSelectedSectionRange: React.Dispatch<React.SetStateAction<SectionRange>>;
	handleCreateSection: (section: SectionName, date?: Date) => Promise<void>;
	setRangeMode: React.Dispatch<React.SetStateAction<RangeMode>>;
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
			{sections.map((section, idx) => {
				const { summary, morning_section, evening_section } = section;
				const date = new Date(section.date);
				const handleToggle = () => {
					setRangeMode("day");
					setSelectedSectionRange({
						type: "day",
						date: date,
					});
				};

				if (!morning_section && !evening_section) {
					return (
						<Pressable
							onPress={handleToggle}
							key={idx}
						>
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
					);
				}

				return (
					<View
						key={idx}
						className="bg-white rounded-3xl p-4 mb-6 shadow-md"
					>
						<WeekSummaryCard
							date={date}
							summary={summary}
							handleToggle={handleToggle}
						/>

						<WeekSectionCard
							name="Morning"
							data={morning_section}
							date={date}
						/>
						<WeekSectionCard
							name="Evening"
							data={evening_section}
							date={date}
						/>
					</View>
				);
			})}
		</>
	);
};

export default ManageWeekSummary;
