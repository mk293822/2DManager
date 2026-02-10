import { NotificationProvider } from "@/components/ui/notification";
import { AuthContextProvider } from "@/contexts/auth-context-provider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
	return (
		<AuthContextProvider>
			<SafeAreaProvider>
				<NotificationProvider>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(tabs)" />
						<Stack.Screen name="(auth)" />
					</Stack>
				</NotificationProvider>
			</SafeAreaProvider>
		</AuthContextProvider>
	);
}
