import { NotificationProvider } from "@/components/ui/notification";
import { AuthContextProvider } from "@/contexts/auth-context-provider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import ManageProvider from "@/contexts/manage-provider";
import OfflineActionHandler from "@/lib/offline-action-handler";

export default function RootLayout() {
	return (
		<>
			<AuthContextProvider>
				<SafeAreaProvider>
					<NotificationProvider>
						<ManageProvider>
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Screen name="(tabs)" />
								<Stack.Screen name="(auth)" />
							</Stack>
						</ManageProvider>
					</NotificationProvider>
				</SafeAreaProvider>
			</AuthContextProvider>
			<OfflineActionHandler />
		</>
	);
}
