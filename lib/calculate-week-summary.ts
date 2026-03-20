/////////////////////////
// Week Section Summary
/////////////////////////

import {
	SectionSaleGroup,
	SectionSaleSummary,
} from "@/types/bussiness-user-types";
import { SectionSummaries, SectionSummary } from "@/types/manage-types";
import {
	SectionNumericFields,
	SectionSaleNumericFields,
} from "./calculate-summary";

export function calculateWeekSectionSummary(
	days: SectionSummaries[],
): SectionSummary {
	const summary = {} as SectionSummary;

	SectionNumericFields.forEach((field) => {
		summary[field] = days.reduce((acc, day) => {
			return acc + (day.summary?.[field] ?? 0);
		}, 0);
	});

	return summary;
}

/////////////////////////
// Week SectionSale Summary
/////////////////////////

export function calculateWeekSectionSaleSummary(
	days: SectionSaleGroup[],
): SectionSaleSummary {
	const summary = {} as SectionSaleSummary;

	SectionSaleNumericFields.forEach((field) => {
		summary[field] = days.reduce((acc, day) => {
			return acc + (day.summary?.[field] ?? 0);
		}, 0);
	});

	return summary;
}
