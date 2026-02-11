export type resultTime = "11:00:00" | "12:01:00" | "15:00:00" | "16:30:00";

type TimeRange = {
	start: number; // inclusive (seconds)
	end: number; // exclusive (seconds)
	result: resultTime;
};

export const toSeconds = (time: string) => {
	const [h, m, s] = time.split(":").map(Number);
	return h * 3600 + m * 60 + s;
};

const TIME_RANGES: TimeRange[] = [
	// 16:30 → next day 09:00
	{
		start: toSeconds("16:30:00"),
		end: 24 * 3600,
		result: "16:30:00",
	},
	{
		start: 0,
		end: toSeconds("09:00:00"),
		result: "16:30:00",
	},

	// 15:00 → 16:29
	{
		start: toSeconds("15:00:00"),
		end: toSeconds("16:30:00"),
		result: "16:30:00",
	},

	// 13:00 → 15:00
	{
		start: toSeconds("13:00:00"),
		end: toSeconds("15:00:00"),
		result: "15:00:00",
	},

	// 11:00 → 12:59
	{
		start: toSeconds("11:00:00"),
		end: toSeconds("13:00:00"),
		result: "12:01:00",
	},

	// 09:00 → 10:59
	{
		start: toSeconds("09:00:00"),
		end: toSeconds("11:00:00"),
		result: "11:00:00",
	},
];

export function getTwoDResultTime(isHoliday: boolean = false): resultTime {
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
