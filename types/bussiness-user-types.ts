import { SectionName } from "./manage-types";

export type BussinessUserType = "commission_user" | "resold_user";

export type BussinessUser = {
	id: string;
	name: string;
	phone_number: string;
	section_sales: SectionSaleGroup;
	manager_name: string;
	default_commission_percent: number;
};

export type SectionSaleGroup = {
	date: string;
	morning_section: SectionSale;
	evening_section: SectionSale;
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
	section_summary: {
		id: string;
		date: string;
		draw_number: string;
		draw_times: number;
		section: SectionName;
		numbers_exists: boolean;
	};
	commission_percent: number;
	total_amount: number;
	total_commission: number;
	profit_or_loss: number;
	include_draw_number: boolean;
	total_draw_amount: number;
	total_draw_value: number;
};
