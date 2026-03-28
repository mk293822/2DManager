import { NotificationProvider } from "@/components/ui/notification";
import { AuthContextProvider } from "@/contexts/auth-context-provider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import ManageProvider from "@/contexts/manage-provider";
import { clearAllCache } from "@/hooks/use-cache";
import { scheduleCacheClearAtMidnight } from "@/lib/datetime-helper";
import OfflineActionHandler from "@/lib/offline-action-handler";

export default function RootLayout() {
	scheduleCacheClearAtMidnight(clearAllCache);
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
