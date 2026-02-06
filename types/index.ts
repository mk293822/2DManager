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

export type TwoDChild = {
	time: string; // e.g., "15:11:52"
	set: string; // e.g., "1,625.46"
	value: string; // e.g., "48,896.35"
	twod: string; // e.g., "66"
};

export type TwoDData = {
	date: string; // e.g., "2021-11-05"
	child: TwoDChild[];
};
