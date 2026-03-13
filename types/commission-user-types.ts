import { SectionName } from "./manage-types";

export type CommissionUserType = {
	id: string;
	name: string;
	phone_number: string;
	section_sales: SectionSaleGroup;
	manager_name: string;
	default_commission_percent: number;
};

export type SectionSaleGroup = {
	date: string;
	morning_section: ComUserSectionSaleType;
	evening_section: ComUserSectionSaleType;
	summary: ComUserSectionSaleSummary;
};

export type ComUserSectionSaleSummary = {
	total_amount: number;
	total_commission: number;
	profit_or_loss: number;
	total_draw_value: number;
	total_draw_amount: number;
};

export type ComUserSectionSaleType = {
	id: string;
	section_summary: {
		id: string;
		date: string;
		draw_number: string;
		draw_times: number;
		section: SectionName;
		sold_numbers_exists: boolean;
	};
	commission_percent: number;
	total_amount: number;
	total_commission: number;
	profit_or_loss: number;
	include_draw_number: boolean;
	total_draw_amount: number;
	total_draw_value: number;
};
