import { SectionName, SectionSummaries } from "@/types/manage-types";
import React from "react";
import DaySectionCard from "./day-section-card";
import DaySummaryCard from "./day-summary-card";

const ManageDaySummary = ({
	sections,
	selectedDate,
}: {
	sections: SectionSummaries;
	selectedDate: Date;
}) => {
	const sectionList: SectionName[] = ["morning_section", "evening_section"];

	if (!sections) return null;
	return (
		<>
			<DaySummaryCard
				summary={sections.summary}
				selectedDate={selectedDate}
			/>
			{sectionList.map((sec) => (
				<DaySectionCard
					key={sec}
					section={sec}
					data={sections[sec]}
				/>
			))}
		</>
	);
};

export default ManageDaySummary;
