export interface NumberData {
	number: string;
	value: number;
	resold: number;
}

export interface SessionStats {
	totalSold: number;
	exceedTotal: number;
	resoldTotal: number;
	commission: number;
	payoutToWinners: number;
	profitLoss: number;
}

export interface DayData {
	date: string;
	morning: SessionStats;
	evening: SessionStats;
	summary: {
		totalSold: number;
		exceedTotal: number;
		resoldTotal: number;
		commission: number;
		profitLoss: number;
	};
}
