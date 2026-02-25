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

// Event Bus
export type AppEvents = NotificationEvents;
