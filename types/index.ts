export type TwoDResponse = {
	server_time: string;

	live: {
		set: string;
		value: string;
		time: string;
		twod: string;
		date: string;
	};

	result: TwoDHistoryItem[];

	holiday: {
		status: string;
		date: string;
		name: string | null;
	};
};

export type TwoDHistoryItem = {
	set: string;
	value: string;
	open_time: string;
	twod: string;
	stock_date: string;
	stock_datetime: string;
	history_id: string;
};
