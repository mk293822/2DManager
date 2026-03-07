import { NotificationProvider } from "@/components/ui/notification";
import { AuthContextProvider } from "@/contexts/auth-context-provider";
import TwoDListProvider from "@/contexts/two-d-list-context";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import CommissionUserDetailsProvider from "@/contexts/commission-user-details-provider";
import CommissionUserProvider from "@/contexts/commission-user-provider";
import ManageProvider from "@/contexts/manage-provider";

export default function RootLayout() {
	return (
		<AuthContextProvider>
			<SafeAreaProvider>
				<NotificationProvider>
					<ManageProvider>
						<CommissionUserProvider>
							<TwoDListProvider>
								<CommissionUserDetailsProvider>
									<Stack screenOptions={{ headerShown: false }}>
										<Stack.Screen name="(tabs)" />
										<Stack.Screen name="(auth)" />
									</Stack>
								</CommissionUserDetailsProvider>
							</TwoDListProvider>
						</CommissionUserProvider>
					</ManageProvider>
				</NotificationProvider>
			</SafeAreaProvider>
		</AuthContextProvider>
	);
}
