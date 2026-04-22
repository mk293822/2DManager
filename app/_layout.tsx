import { NotificationProvider } from "@/components/ui/notification";
import { AuthContextProvider } from "@/contexts/auth-context-provider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import ManageProvider from "@/contexts/manage-provider";
import OfflineActionHandler from "@/lib/offline-action-handler";

import { Loading } from "@/components/loading";
import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

import { vexo } from 'vexo-analytics';
// Vexo
const VEXO_API_KEY = process.env.EXPO_PUBLIC_VEXO_API_KEY;
vexo(VEXO_API_KEY)

export default function RootLayout() {
	const [isCheckingUpdate, setIsCheckingUpdate] = useState(true);
	const [updateMessage, setUpdateMessage] = useState("Checking updates...");

	useEffect(() => {
		let isMounted = true;

		const checkUpdate = async () => {
			try {
				// ⏱️ timeout wrapper (5 seconds)
				const timeout = new Promise((_, reject) =>
					setTimeout(() => reject(new Error("Update timeout")), 5000),
				);

				const updatePromise = Updates.checkForUpdateAsync();

				const result = (await Promise.race([
					updatePromise,
					timeout,
				])) as Updates.UpdateCheckResult;

				if (!isMounted) return;

				if (result.isAvailable) {
					setUpdateMessage("Downloading update...");

					await Updates.fetchUpdateAsync();

					setUpdateMessage("Restarting app...");

					await Updates.reloadAsync();
				}
			} catch {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Update Check Failed",
					description:
						"Failed to check for updates. Please make sure you have a stable internet connection.",
				});
			} finally {
				if (isMounted) setIsCheckingUpdate(false);
			}
		};

		checkUpdate();

		return () => {
			isMounted = false;
		};
	}, []);

	// -------------------------
	// Show loading screen while checking OTA
	// -------------------------
	if (isCheckingUpdate) {
		return <Loading message={updateMessage} />;
	}

	// -------------------------
	// App UI
	// -------------------------
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
