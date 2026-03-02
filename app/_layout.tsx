import { NotificationProvider } from "@/components/ui/notification";
import { AuthContextProvider } from "@/contexts/auth-context-provider";
import TwoDListProvider from "@/contexts/two-d-list-context";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
	return (
		<AuthContextProvider>
			<SafeAreaProvider>
				<NotificationProvider>
					<TwoDListProvider>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="(tabs)" />
							<Stack.Screen name="(auth)" />
						</Stack>
					</TwoDListProvider>
				</NotificationProvider>
			</SafeAreaProvider>
		</AuthContextProvider>
	);
}
