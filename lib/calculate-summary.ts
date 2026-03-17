/////////////////////////
// Helper
/////////////////////////

import { SectionSale, SectionSaleSummary } from "@/types/bussiness-user-types";
import { Section, SectionSummary } from "@/types/manage-types";

function sum(a?: number, b?: number): number {
	return (a ?? 0) + (b ?? 0);
}

/////////////////////////
// Section Summary
/////////////////////////

const SectionNumericFields: (keyof SectionSummary)[] = [
	"total_amount",
	"total_commission",
	"total_draw_amount",
	"total_draw_value",
	"profit_or_loss",
	"total_resold",
	"total_resold_commission",
	"total_resold_draw_value",
	"total_resold_draw_amount",
];

/** Type-safe summary for Section */
export function calculateSectionSummary(
	morning: Section | null,
	evening: Section | null,
): SectionSummary {
	const summary = {} as SectionSummary;

	SectionNumericFields.forEach((field) => {
		const morningVal = morning?.[field] ?? 0;
		const eveningVal = evening?.[field] ?? 0;
		summary[field] = sum(morningVal, eveningVal);
	});

	return summary;
}

/////////////////////////
// SectionSale Summary
/////////////////////////

const SectionSaleNumericFields: (keyof SectionSaleSummary)[] = [
	"total_amount",
	"total_commission",
	"profit_or_loss",
	"total_draw_value",
	"total_draw_amount",
];

/** Type-safe summary for SectionSale */
export function calculateSectionSaleSummary(
	morning: SectionSale | null,
	evening: SectionSale | null,
): SectionSaleSummary {
	const summary = {} as SectionSaleSummary;

	SectionSaleNumericFields.forEach((field) => {
		const morningVal = morning?.[field] ?? 0;
		const eveningVal = evening?.[field] ?? 0;
		summary[field] = sum(morningVal, eveningVal);
	});

	return summary;
}
