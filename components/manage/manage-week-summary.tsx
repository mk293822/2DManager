import { formatDateDisplay } from "@/lib/helpers";
import {
	RangeMode,
	SectionName,
	SectionRange,
	SectionSummaries,
} from "@/types/manage-types";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import WeekSectionCard from "./week-section-card";
import WeekSummaryCard from "./week-summary-card";

/* ===== Week Summary ===== */
const ManageWeekSummary = ({
	sections,
	setSelectedSectionRange,
	handleCreateSection,
	setRangeMode,
}: {
	sections: SectionSummaries[];
	setSelectedSectionRange: React.Dispatch<React.SetStateAction<SectionRange>>;
	handleCreateSection: (section: SectionName, date?: Date) => Promise<void>;
	setRangeMode: React.Dispatch<React.SetStateAction<RangeMode>>;
}) => {
	const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

	// use a map keyed by date + section type
	const createSection = async (section: SectionName, date: Date) => {
		const key = `${date.toISOString()}_${section}`; // unique per button
		setLoadingMap((prev) => ({ ...prev, [key]: true }));

		await handleCreateSection(section, date);

		setLoadingMap((prev) => ({ ...prev, [key]: false }));
	};

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

				if (!morning_section && !evening_section) {
					return (
						<View
							key={idx}
							className="bg-white rounded-2xl p-6 mb-4 items-center shadow"
						>
							<Text className="text-gray-500 font-medium text-center mb-3">
								No sections available for {formatDateDisplay(new Date(date))}
							</Text>

							<Text className="text-gray-400 text-sm text-center mb-4">
								You can create sections for this day below.
							</Text>

							<View className="flex-row gap-3">
								<TouchableOpacity
									activeOpacity={0.85}
									onPress={() => createSection("morning_section", date)}
									disabled={
										loadingMap[`${date.toISOString()}_morning_section`] ||
										loadingMap[`${date.toISOString()}_evening_section`]
									}
									className={`px-4 py-3 rounded-xl shadow flex-1 items-center ${
										loadingMap[`${date.toISOString()}_morning_section`]
											? "bg-gray-400"
											: "bg-indigo-500"
									}`}
								>
									<Text className="text-white font-semibold text-center">
										{loadingMap[`${date.toISOString()}_morning_section`]
											? "Creating…"
											: "Create Morning"}
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									activeOpacity={0.85}
									onPress={() => createSection("evening_section", date)}
									disabled={
										loadingMap[`${date.toISOString()}_morning_section`] ||
										loadingMap[`${date.toISOString()}_evening_section`]
									}
									className={`px-4 py-3 rounded-xl shadow flex-1 items-center ${
										loadingMap[`${date.toISOString()}_evening_section`]
											? "bg-gray-400"
											: "bg-indigo-500"
									}`}
								>
									<Text className="text-white font-semibold text-center">
										{loadingMap[`${date.toISOString()}_evening_section`]
											? "Creating…"
											: "Create Evening"}
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
							setRangeMode={setRangeMode}
							date={date}
							summary={summary}
							setSelectedSectionRange={setSelectedSectionRange}
						/>

						<WeekSectionCard
							name="Morning"
							data={morning_section}
							date={section.date}
						/>
						<WeekSectionCard
							name="Evening"
							data={evening_section}
							date={section.date}
						/>
					</View>
				);
			})}
		</>
	);
};

export default ManageWeekSummary;
