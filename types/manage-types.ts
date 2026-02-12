export type Section = "morning_section" | "evening_section";
export type SectionSummary = {
	id: string;
	manager: string;
	section: Section;
	draw_number: string;
	draw_times: string;
	total_amount: number;
	total_commission: number;
	total_resold: number;
	date: string;
	profit_or_loss: number;
	draw_total_amount: number;
};

export type SectionSummaries = {
	summary: {
		total_amount: number;
		total_commission: number;
		total_resold: number;
		profit_or_loss: number;
		date: string; // or Date if you convert it
		draw_total_amount: number;
	};
	morning_section: SectionSummary;
	evening_section: SectionSummary;
};
