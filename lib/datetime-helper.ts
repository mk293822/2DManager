import { WeekRange } from "@/types/manage-types";

export const DAYS: string[] = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export function getWeekRangeFromDate(dateInput: string | Date) {
	const date = new Date(dateInput);

	// JS: Sunday = 0, Monday = 1 ... Saturday = 6
	const day = date.getDay();

	// convert so Monday = 0, Sunday = 6
	const diffToMonday = (day + 6) % 7;

	const start = new Date(date);
	start.setDate(date.getDate() - diffToMonday);

	const end = new Date(start);
	end.setDate(start.getDate() + 6);

	return { start, end };
}

export type Week = { start: Date; end: Date; label: string };

export function getWeeksForYear(year: number): Week[] {
	const weeks: Week[] = [];
	let date = new Date(year, 0, 1);

	// Move to first Monday
	const day = date.getDay();
	if (day !== 1) date.setDate(date.getDate() + ((8 - day) % 7));

	while (date.getFullYear() === year) {
		const start = new Date(date);
		const end = new Date(date);
		end.setDate(end.getDate() + 6);

		const startLabel = start.toLocaleDateString("default", {
			day: "2-digit",
			month: "short",
		});
		const endLabel = end.toLocaleDateString("default", {
			day: "2-digit",
			month: "short",
		});

		weeks.push({ start, end, label: `${startLabel} – ${endLabel}` });

		date.setDate(date.getDate() + 7);
	}

	return weeks;
}

export function isToday(date: string | Date) {
	if (typeof date === "string")
		return new Date(date).toDateString() === new Date().toDateString();
	return date.toDateString() === new Date().toDateString();
}

export function formatTimeIntl(
	time: string = "00:00:00",
	showSecond: boolean = false,
): string {
	// Split time into parts
	const [hh, mm, ss] = time.split(":").map(Number);

	// Convert to 12-hour format manually
	const hour12 = hh % 12 === 0 ? 12 : hh % 12;
	const ampm = hh < 12 || hh === 24 ? "AM" : "PM";
	const minute = String(mm).padStart(2, "0");

	return `${hour12}:${minute}${showSecond ? ":" + ss.toString() : ""} ${ampm}`;
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

export const formatWeekDisplay = (range: WeekRange) => {
	const start = new Date(range.start_date);
	const end = new Date(range.end_date);
	const startMonth = start.toLocaleString("default", { month: "short" });
	const endMonth = end.toLocaleString("default", { month: "short" });

	// Get week number by finding which week in the year contains this date
	const weeksOfYear = getWeeksForYear(start.getFullYear());
	const weekNumber =
		weeksOfYear.findIndex((week) => {
			const weekStart = new Date(week.start);
			const weekEnd = new Date(week.end);
			weekStart.setHours(0, 0, 0, 0);
			weekEnd.setHours(23, 59, 59, 999);
			const dateToCheck = new Date(start);
			dateToCheck.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
			return dateToCheck >= weekStart && dateToCheck <= weekEnd;
		}) + 1; // +1 because findIndex returns 0-based index

	if (startMonth === endMonth) {
		return `Week ${weekNumber}: ${startMonth} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
	}
	return `Week ${weekNumber}: ${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
};
