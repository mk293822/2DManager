export type BussinessUserType = "commission_user" | "resold_user";

export type BaseUser = {
	id: string;
	name: string;
	phone_number: string;
	manager_name: string;
	default_commission_percent: number;
};

export type CommissionUser = BaseUser & {
	user_type: "commission_user";
};

export type ResoldUser = BaseUser & {
	user_type: "resold_user";
	default_draw_times: number;
};

export type BussinessUser = CommissionUser | ResoldUser;

export type SectionSaleGroup = {
	date: string;
	morning_section: SectionSale | null;
	evening_section: SectionSale | null;
	summary: SectionSaleSummary;
};

export type SectionSaleSummary = {
	total_amount: number;
	total_commission: number;
	profit_or_loss: number;
	total_draw_value: number;
	total_draw_amount: number;
};

export type SectionSale = {
	id: string;
	commission_percent: number;
	total_amount: number;
	total_commission: number;
	profit_or_loss: number;
	include_draw_number: boolean;
	total_draw_amount: number;
	total_draw_value: number;
	draw_times: number;
	draw_number: string;
	section_summary_id: string;
	numbers_exists: boolean;
};
