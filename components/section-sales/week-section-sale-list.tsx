import { calculateWeekSectionSaleSummary } from "@/lib/calculate-week-summary";
import { formatDateDisplay } from "@/lib/helpers";
import { SectionSaleGroup } from "@/types/bussiness-user-types";
import { RangeMode, SectionRange } from "@/types/manage-types";
import React from "react";
import { Pressable, Text, View } from "react-native";
import SectionSummaryCard from "./section-summary-card";

type Props = {
	sectionSales: SectionSaleGroup[] | null;
	setSelectedSectionRange: React.Dispatch<React.SetStateAction<SectionRange>>;
	setRangeMode: React.Dispatch<React.SetStateAction<RangeMode>>;
};

const WeekSectionSaleList = ({
	sectionSales,
	setRangeMode,
	setSelectedSectionRange,
}: Props) => {
	if (!sectionSales || sectionSales.length === 0) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 p-6">
				<View className="bg-white rounded-2xl shadow p-6 w-full max-w-sm items-center">
					<Text className="text-gray-500 text-center text-lg mb-4">
						No sections available for this week.{" "}
					</Text>

					<Text className="text-gray-400 text-center text-sm mb-6">
						It looks like there are no records yet.
					</Text>
				</View>
			</View>
		);
	}

	const weekSummary = calculateWeekSectionSaleSummary(sectionSales);

	return (
		<>
			<SectionSummaryCard
				type="week"
				summary={weekSummary}
			/>
			{sectionSales.map((section, idx) => {
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
					<SectionSummaryCard
						type="day"
						key={idx}
						summary={summary}
						date={section.date}
						handleToggle={handleToggle}
						showDetailsBtn
					/>
				);
			})}
		</>
	);
};

export default WeekSectionSaleList;
