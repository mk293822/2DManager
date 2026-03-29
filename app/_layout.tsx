import { NotificationProvider } from "@/components/ui/notification";
import { AuthContextProvider } from "@/contexts/auth-context-provider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import ManageProvider from "@/contexts/manage-provider";
import { clearAllCache } from "@/hooks/use-cache";
import { scheduleCacheClearAtMidnight } from "@/lib/datetime-helper";
import OfflineActionHandler from "@/lib/offline-action-handler";

// ✅ ADD THIS
import { Loading } from "@/components/loading";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

export default function RootLayout() {
	scheduleCacheClearAtMidnight(clearAllCache);

	const [isUpdating, setIsUpdating] = useState(true);

	useEffect(() => {
		async function checkUpdate() {
			try {
				const update = await Updates.checkForUpdateAsync();

				if (update.isAvailable) {
					await Updates.fetchUpdateAsync();
					await Updates.reloadAsync(); // 🔥 reload app with new update
				}
			} catch (e) {
				console.log("Update error:", e);
			} finally {
				setIsUpdating(false);
			}
		}

		checkUpdate();
	}, []);

	if (isUpdating) {
		return <Loading />;
	}

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
