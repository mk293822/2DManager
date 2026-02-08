import { EVENT_NAMES } from "@/lib/event-name";

export type NotificationPayload = {
	title: string;
	description?: string;
	type?: "success" | "error" | "info";
};

export type Notification = NotificationPayload & {
	id: number;
};

export type NotificationEvents = {
	[EVENT_NAMES.NOTIFICATION]: NotificationPayload;
};

export type AppEvents = NotificationEvents;
