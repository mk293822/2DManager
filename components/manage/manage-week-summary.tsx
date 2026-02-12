import { formatDateDisplay } from "@/lib/helpers";
import { SectionName, SectionSummaries } from "@/types/manage-types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import WeekSectionCard from "./week-section-card";
import WeekSummaryCard from "./week-summary-card";

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
			{sections.map((section, idx) => {
				const { summary, morning_section, evening_section } = section;
				const date = new Date(summary.date);

				if (!morning_section && !evening_section) {
					return (
						<View
							key={idx}
							className="bg-white rounded-2xl p-6 mb-4 items-center shadow"
						>
							<Text className="text-gray-500 font-medium text-center mb-3">
								No sections available for{" "}
								{formatDateDisplay(new Date(summary.date))}
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
					<View
						key={idx}
						className="bg-white rounded-3xl p-4 mb-6 shadow-md"
					>
						<WeekSummaryCard
							date={date}
							summary={summary}
						/>

						<WeekSectionCard
							name="Morning"
							data={morning_section}
							date={summary.date}
						/>
						<WeekSectionCard
							name="Evening"
							data={evening_section}
							date={summary.date}
						/>
					</View>
				);
			})}
		</>
	);
};

export default ManageWeekSummary;
