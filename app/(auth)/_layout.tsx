import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";

const AuthLayout = () => {
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS moves content with padding, Android adjusts height
			keyboardVerticalOffset={Platform.OS === "ios" ? 80 : -80} // adjust if you have a header
		>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { flex: 1 },
				}}
			/>
		</KeyboardAvoidingView>
	);
};

export default AuthLayout;
