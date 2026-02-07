type TimeRange = {
	start: number; // inclusive (seconds)
	end: number; // exclusive (seconds)
	result: string;
};

const toSeconds = (h: number, m = 0, s = 0) => h * 3600 + m * 60 + s;

const TIME_RANGES: TimeRange[] = [
	// 16:30 → next day 09:00
	{
		start: toSeconds(16, 30),
		end: 24 * 3600,
		result: "16:30:00",
	},
	{
		start: 0,
		end: toSeconds(9, 0),
		result: "16:30:00",
	},

	// 13:00 → 16:29
	{
		start: toSeconds(13, 0),
		end: toSeconds(16, 30),
		result: "16:30:00",
	},

	// 11:00 → 12:59
	{
		start: toSeconds(11, 0),
		end: toSeconds(13, 0),
		result: "12:01:00",
	},

	// 09:00 → 10:59
	{
		start: toSeconds(9, 0),
		end: toSeconds(11, 0),
		result: "11:00:00",
	},
];

export function getTwoDResultTime(isHoliday: boolean = false): string {
	if (isHoliday) return "16:30:00";

	const date = new Date();
	const nowSeconds =
		date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

	for (const range of TIME_RANGES) {
		if (nowSeconds >= range.start && nowSeconds < range.end) {
			return range.result;
		}
	}

	// Safety fallback (should never hit)
	return "16:30:00";
}
