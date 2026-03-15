export type SectionName = "morning_section" | "evening_section";

export type Section = {
	id: string;
	date: string;
	section: SectionName;

	manager_name: string;

	draw_number: string | null;
	draw_times: number;

	numbers_exists: boolean;

	total_amount: number;
	total_commission: number;
	total_resold: number;

	total_resold_commission: number;
	total_resold_draw_value: number;
	total_resold_draw_amount: number;

	total_draw_amount: number;
	total_draw_value: number;

	profit_or_loss: number;

	created_at: string;
	updated_at: string;
};

export type SectionSummary = {
	total_amount: number;
	total_commission: number;
	total_resold: number;

	total_draw_amount: number;
	total_draw_value: number;

	total_resold_commission: number;
	total_resold_draw_amount: number;
	total_resold_draw_value: number;

	profit_or_loss: number;
};

export type SectionSummaries = {
	date: string;
	summary: SectionSummary;
	morning_section: Section | null;
	evening_section: Section | null;
};

// Manage Page Header Right
export type RangeMode = "day" | "week";

export type DayRange = {
	type: "day";
	date: Date;
};

export type WeekRange = {
	type: "week";
	year: number;
	month: number; // 1–12 (backend-friendly)
	week: number;
};

export type SectionRange = DayRange | WeekRange;
