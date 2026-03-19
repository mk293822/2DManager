import { SectionName } from "./manage-types";

export type NumberType = "sold_number" | "resold_number";
export type FilterModeType = "all" | "greater" | "less";
export type SoldNumberItemType = "normal" | "digit_related" | "special_group";

export type SpecialGroupValue1 =
	| "APU"
	| "SONE_PU"
	| "MA_PU"
	| "PA_WA"
	| "NAK_KET";

export type SpecialGroupValue2 = "OOK_SU" | "TAIT" | "PATE";

export type NormalItem = {
	type: "normal";
	number: string;
	value?: null;
	amount1: number;
	amount2?: number;
};

export type DigitRelatedItem = {
	type: "digit_related";
	value: SpecialGroupValue2;
	number: string;
	amount1: number;
	amount2?: null;
};

export type SpecialGroupItem = {
	type: "special_group";
	value: SpecialGroupValue1;
	number?: never | string;
	amount1: number;
	amount2?: null;
};

export type NumberItem = NormalItem | DigitRelatedItem | SpecialGroupItem;

export type TwoDListType = {
	id: string;
	section_sale: string;
	numbers_data: NumberItem[];
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

export type NumberEntry = {
	number: string;
	items: NumberItem[];
	value: number;
};
