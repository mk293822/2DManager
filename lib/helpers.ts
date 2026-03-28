import { SectionSaleGroup } from "@/types/bussiness-user-types";
import {
	Section,
	SectionName,
	SectionSummaries,
	SectionSummary,
} from "@/types/manage-types";

export const formatSmartNumber = (num: number | string) => {
	const n = Number(num);
	if (Number.isNaN(n)) return "0";
	// limit to 3 decimal places
	const str = n.toFixed(3);
	// remove trailing zeros and possible trailing dot
	return str.replace(/\.?0+$/, "");
};

export const formatKs = (num: number) => `${num.toLocaleString()} Ks`;

export const changeSectionName = (section: SectionName) =>
	section === "morning_section" ? "Morning" : "Evening";

export const getTotalArray = (
	data: SectionSummary | Section,
): [string, number][] => [
	["Total Sold", data.total_amount],
	["Total Commission", data.total_commission],
	["Total Draw Value", data.total_draw_value],
	["Total Draw Amount", data.total_draw_amount],
	["Total Resold", data.total_resold],
	["Total Resold Commission", data.total_resold_commission],
	["Total Resold Draw Value", data.total_resold_draw_value],
	["Total Resold Draw Amount", data.total_resold_draw_amount],
];

export function changePlace(value: string) {
	if (value.length > 2) return value;

	return value.trim().split("").reverse().join("");
}

export function isNumber(value: string) {
	return !isNaN(Number(value));
}

export type ParsedErrors<T extends string = string> = {
	fields: Partial<Record<T, string>>;
	form?: string;
};

export function parseErrors<T extends string>(
	data: any,
	fields: T[] = [],
): ParsedErrors<T> {
	const fieldErrors: Partial<Record<T, string>> = {};
	let formError: string | undefined;

	// Parse field errors
	fields.forEach((field) => {
		if (data?.[field]) {
			fieldErrors[field] = Array.isArray(data[field])
				? data[field].join(" ")
				: String(data[field]);
		}
	});

	// Parse non_field_errors
	if (data?.non_field_errors) {
		formError = Array.isArray(data.non_field_errors)
			? data.non_field_errors.join(" ")
			: String(data.non_field_errors);
	}

	// Parse DRF/SimpleJWT detail errors
	if (!formError && data?.detail) {
		formError = String(data.detail);
	}

	return {
		fields: fieldErrors,
		form: formError,
	};
}

export function upsertByDate<T extends SectionSummaries | SectionSaleGroup>(
	prev: T[] | null,
	newDay: T,
) {
	if (!prev) return [newDay];
	const idx = prev.findIndex((d) => d.date === newDay.date);
	if (idx !== -1) {
		const newSections = [...prev];
		newSections[idx] = newDay;
		return newSections.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	}
	return [...prev, newDay].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);
}

export const formatPhone = (digits: string) => {
	// Example: 0912345678 -> 09 123 456 78
	const cleaned = digits.replace(/\D/g, "");

	if (cleaned.length <= 2) return cleaned;
	if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
	if (cleaned.length <= 8)
		return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;

	return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 11)}`;
};
