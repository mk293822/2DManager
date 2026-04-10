import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import { Linking } from "react-native";

export const usePhoneActions = () => {
	const call = async (phoneNumber: string) => {
		try {
			await Linking.openURL(`tel:${phoneNumber}`);
		} catch {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Error",
				description: "Unable to open dialer.",
				type: "error",
			});
		}
	};

	const message = async (phoneNumber: string) => {
		try {
			await Linking.openURL(`sms:${phoneNumber}`);
		} catch {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Error",
				description: "Unable to open messages.",
				type: "error",
			});
		}
	};

	return { call, message };
};
