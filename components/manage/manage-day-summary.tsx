import { Section, SectionName, SectionSummaries } from "@/types/manage-types";
import React from "react";
import DaySectionCard from "./day-section-card";
import DaySummaryCard from "./day-summary-card";

const ManageDaySummary = ({
	sections,
	selectedDate,
	handleCreateSection,
	onSave,
}: {
	sections: SectionSummaries;
	selectedDate: Date;
	handleCreateSection: (section: SectionName) => void;
	onSave: (section: Omit<Section, "id" | "manager" | "section">) => void;
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
					onSave={onSave}
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
