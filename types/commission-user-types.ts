import { SectionName } from "./manage-types";

export type CommissionUserType = {
	id: string;
	name: string;
	phone_number: string;
	section_sales: SectionSaleGroup;
	manager_name: string;
	manager: number;
};

export type SectionSaleGroup = {
	morning_section: ComUserSectionSaleType;
	evening_section: ComUserSectionSaleType;
	summary: ComUserSectionSaleSummary;
};

export type ComUserSectionSaleSummary = {
	total_amount: number;
	total_commission: number;
	profit_or_loss: number;
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
	};
	commission_percent: number;
	total_amount: number;
	total_commission: number;
	profit_or_loss: number;
	include_draw_number: boolean;
	total_draw_amount: number;
};
