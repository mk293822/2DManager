import { SectionName } from "@/types/manage-types";

export const DAYS: string[] = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export const formatSmartNumber = (num: number | string) => {
	const n = Number(num);
	if (Number.isNaN(n)) return "0";
	// limit to 3 decimal places
	const str = n.toFixed(3);
	// remove trailing zeros and possible trailing dot
	return str.replace(/\.?0+$/, "");
};

export const formatKs = (num: number) => `${num.toLocaleString()} Ks`;

export function formatTimeIntl(time: string = "00:00:00"): string {
	// Split time into parts
	const [hh, mm, ss] = time.split(":").map(Number);

	// Convert to 12-hour format manually
	const hour12 = hh % 12 === 0 ? 12 : hh % 12;
	const ampm = hh < 12 || hh === 24 ? "AM" : "PM";
	const minute = String(mm).padStart(2, "0");

	return `${hour12}:${minute} ${ampm}`;
}

export const formatDateDisplay = (date: Date) => {
	const dayName = DAYS[date.getDay()];
	const month = date.toLocaleString("default", { month: "short" });
	const day = date.getDate();
	const year = date.getFullYear();
	return `${dayName}, ${month} ${day}, ${year}`;
};

export const formatDateRequest = (date: Date) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const changeSectionName = (section: SectionName) =>
	section === "morning_section" ? "Morning" : "Evening";

export const getTotalArray = (data: any): [string, number][] => [
	["Total Sold", data.total_amount],
	["Total Resold", data.total_resold],
	["Total Commission", data.total_commission],
	["Total Draw Value", data.total_draw_value],
];

export function getWeekOfMonth(date: Date): number {
	const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
	const dayOfMonth = date.getDate();
	const startDay = firstDayOfMonth.getDay(); // 0–6

	return Math.ceil((dayOfMonth + startDay) / 7);
}

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
