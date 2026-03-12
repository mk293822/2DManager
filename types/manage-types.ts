import { User } from "./main";

export type SectionName = "morning_section" | "evening_section";
export type Section = {
	id: string;
	manager: User;
	section: SectionName;
	draw_number: string;
	draw_times: number;
	total_amount: number;
	total_commission: number;
	total_resold: number;
	date: string;
	profit_or_loss: number;
	total_draw_amount: number;
	total_draw_value: number;
	sold_numbers_exists: boolean;
};

export type SectionSummary = {
	total_amount: number;
	total_commission: number;
	total_resold: number;
	profit_or_loss: number;
	total_draw_value: number;
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
