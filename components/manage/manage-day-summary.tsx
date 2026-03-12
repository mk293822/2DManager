import { SectionSummaryEditFields } from "@/hooks/manage/use-manage-hook";
import { ParsedErrors } from "@/lib/helpers";
import { SectionName, SectionSummaries } from "@/types/manage-types";
import React from "react";
import DaySectionCard from "./day-section-card";
import DaySummaryCard from "./day-summary-card";

const ManageDaySummary = ({
	sections,
	handleCreateSection,
	onEditSave,
	onConfirmDelete,
}: {
	sections: SectionSummaries;
	handleCreateSection: (section: SectionName, date?: Date) => Promise<void>;
	onEditSave: (
		form:
			| {
					total_amount: number;
					total_commission: number;
					total_resold: number;
					total_draw_value: number;
			  }
			| {
					draw_number: string;
					draw_times: number;
			  },
		id: string,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<SectionSummaryEditFields>;
	}>;
	onConfirmDelete: (id: string, date: string) => Promise<void>;
}) => {
	const sectionList: SectionName[] = ["morning_section", "evening_section"];

	if (!sections) return null;
	return (
		<>
			<DaySummaryCard
				summary={sections.summary}
				date={sections.date}
			/>
			{sectionList.map((sec) => (
				<DaySectionCard
					handleCreateSection={handleCreateSection}
					onConfirmDelete={onConfirmDelete}
					onEditSave={onEditSave}
					key={sec}
					section={sec}
					data={sections[sec]}
				/>
			))}
		</>
	);
};

export default ManageDaySummary;
