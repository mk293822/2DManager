import { NotificationProvider } from "@/components/ui/notification";
import { AuthContextProvider } from "@/contexts/auth-context-provider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import { Loading } from "@/components/loading";
import NoInternetScreen from "@/components/ui/no-internet-screen";
import BussinessUserProvider from "@/contexts/bussiness-user-provider";
import ManageProvider from "@/contexts/manage-provider";
import { useInternet } from "@/hooks/use-internet";

export default function RootLayout() {
	const isConnected = useInternet();

	if (isConnected === null) {
		return <Loading />; // waiting for network detection
	}

	if (isConnected === false) {
		return <NoInternetScreen />;
	}
	return (
		<AuthContextProvider>
			<SafeAreaProvider>
				<NotificationProvider>
					<ManageProvider>
						<BussinessUserProvider>
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Screen name="(tabs)" />
								<Stack.Screen name="(auth)" />
								<Stack.Screen name="(bussiness)" />
							</Stack>
						</BussinessUserProvider>
					</ManageProvider>
				</NotificationProvider>
			</SafeAreaProvider>
		</AuthContextProvider>
	);
}
