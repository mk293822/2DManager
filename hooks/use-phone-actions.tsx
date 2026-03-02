import { Alert, Linking } from "react-native";

export const usePhoneActions = () => {
	const call = async (phoneNumber: string) => {
		const url = `tel:${phoneNumber}`;
		try {
			const supported = await Linking.canOpenURL(url);
			if (supported) await Linking.openURL(url);
		} catch {
			Alert.alert("Error", "Unable to open dialer.");
		}
	};

	const message = async (phoneNumber: string) => {
		const url = `sms:${phoneNumber}`;
		try {
			const supported = await Linking.canOpenURL(url);
			if (supported) await Linking.openURL(url);
		} catch {
			Alert.alert("Error", "Unable to open messages.");
		}
	};

	return { call, message };
};
