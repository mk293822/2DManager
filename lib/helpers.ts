const DAYS: string[] = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

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
