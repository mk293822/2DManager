import { EVENT_NAMES } from "@/event-names";

// Notifications
export type NotificationPayload = {
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

// Manage Page Header Right
export type RangeMode = "day" | "week";

type ManagePageHeaderRightEvents = {
	[EVENT_NAMES.CHANGE_DATE_RANGE]: RangeMode;
};

// Event Bus
export type AppEvents = NotificationEvents & ManagePageHeaderRightEvents;
