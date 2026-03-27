import { EVENT_NAMES } from "@/event-names";

export type Model =
	| "sectionSummaries"
	| "bussinessUsers"
	| "bussinessUser"
	| "sectionSales"
	| "sectionTwoDList";

// Notifications
type NotificationPayload = {
	title: string;
	description?: string;
	type?: "success" | "error" | "info";
};

export type Notification = NotificationPayload & {
	id: number;
};

type NotificationEvents = {
	[EVENT_NAMES.NOTIFICATION]: NotificationPayload;
};

type OfflineActionEvents = {
	[EVENT_NAMES.OFFLINE_ACTION]: {
		message: string;
		retry: () => void;
	};
};

type OnlineActionEvents = {
	[EVENT_NAMES.ONLINE_ACTION]: {
		action: "create" | "update" | "delete";
		model: Model;
		// 👇 THIS is what you're missing
		id?: string;
		payload?: unknown;

		// optional context (very useful for you)
		meta?: {
			bussinessUserType?: "commission_user" | "resold_user";
			date?: string;
			user_id?: string;
		};
	};
};

// Event Bus
export type AppEvents = NotificationEvents &
	OfflineActionEvents &
	OnlineActionEvents;
