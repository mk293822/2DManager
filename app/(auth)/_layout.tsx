import { useAuthContext } from "@/hooks/auth/use-auth-context";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	View,
} from "react-native";

const AuthLayout = () => {
	const { authLoading, isAuthenticated } = useAuthContext();

	useEffect(() => {
		if (!authLoading && isAuthenticated) {
			router.replace("/");
		}
	}, [authLoading, isAuthenticated]);

	if (authLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100">
				<ActivityIndicator
					size={50}
					color="#2563eb"
				/>
			</View>
		);
	}
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
