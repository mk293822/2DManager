import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<Stack
				screenOptions={{
					headerShown: true,
					headerStyle: {
						backgroundColor: "rgba(49, 46, 129, 0.85)",
					},
					headerTintColor: "#e5e7eb",
					headerTitleStyle: {
						fontWeight: "900" as const,
					},
				}}
			/>
		</SafeAreaProvider>
	);
}
