import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import { Linking } from "react-native";

export const usePhoneActions = () => {
	const call = async (phoneNumber: string) => {
		const url = `tel:${phoneNumber}`;

		try {
			const supported = await Linking.canOpenURL(url);

			if (!supported) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					title: "Error",
					description: "Unable to open dialer.",
					type: "error",
				});
				return;
			}

			await Linking.openURL(url);
		} catch {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Error",
				description: "Unable to open dialer.",
				type: "error",
			});
		}
	};

	const message = async (phoneNumber: string) => {
		const url = `sms:${phoneNumber}`;

		try {
			const supported = await Linking.canOpenURL(url);

			if (!supported) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					title: "Error",
					description: "Unable to open messages.",
					type: "error",
				});
				return;
			}

			await Linking.openURL(url);
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
