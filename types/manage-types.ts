export type SectionName = "morning_section" | "evening_section";
export type Section = {
	id: string;
	manager: string;
	section: SectionName;
	draw_number: string;
	draw_times: number;
	total_amount: number;
	total_commission: number;
	total_resold: number;
	date: string;
	profit_or_loss: number;
	draw_total_amount: number;
};

export type SectionSummary = {
	total_amount: number;
	total_commission: number;
	total_resold: number;
	profit_or_loss: number;
	date: string; // or Date if you convert it
	draw_total_amount: number;
};

export type SectionSummaries = {
	summary: SectionSummary;
	morning_section: Section | null;
	evening_section: Section | null;
};
