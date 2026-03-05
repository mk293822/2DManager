import { SectionName } from "./manage-types";

export type FilterModeType = "all" | "greater" | "less";

export type SoldNumberItem = {
	number: string;
	total_amount: number;
};

export type TwoDListType = {
	id: string;
	section_sale: string;
	numbers_data: SoldNumberItem[];
	created_at: string;
	updated_at: string;
};

export type TwoDListGroup = {
	section_summary: string;
	section: SectionName;
	sold_numbers_by_user: {
		[commission_user: string]: TwoDListType[];
	};
};
