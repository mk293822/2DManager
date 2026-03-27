import { SectionSummaryEditFields } from "@/hooks/manage/use-manage-hook";
import { MutationResult } from "@/hooks/use-mutation";
import { ParsedErrors } from "@/lib/helpers";
import { Section, SectionName, SectionSummaries } from "@/types/manage-types";
import React from "react";
import DaySectionCard from "./day-section-card";
import SummaryCard from "./summary-card";

type Props = {
	sections: SectionSummaries;
	createSection: (variables: {
		sectionName: SectionName;
		date?: Date;
	}) => Promise<MutationResult<SectionSummaries, string>>;
	editSection: (variables: {
		form: Partial<Section>;
		id: string;
	}) => Promise<
		MutationResult<SectionSummaries, ParsedErrors<SectionSummaryEditFields>>
	>;
	deleteSection: (variables: {
		id: string;
		date: string;
	}) => Promise<MutationResult<void, string>>;
	creatingSection: boolean;
	editingSection: boolean;
	deletingSection: boolean;
};

const ManageDaySummary = ({
	sections,
	createSection,
	creatingSection,
	editSection,
	editingSection,
	deleteSection,
	deletingSection,
}: Props) => {
	const sectionList: SectionName[] = ["morning_section", "evening_section"];

	if (!sections) return null;
	return (
		<>
			<SummaryCard
				type="day"
				summary={sections.summary}
				date={sections.date}
			/>
			{sectionList.map((sec) => (
				<DaySectionCard
					createSection={createSection}
					creatingSection={creatingSection}
					editSection={editSection}
					editingSection={editingSection}
					deleteSection={deleteSection}
					deletingSection={deletingSection}
					key={sec}
					sectionName={sec}
					section={sections[sec]}
					date={sections.date}
				/>
			))}
		</>
	);
};

export default ManageDaySummary;
