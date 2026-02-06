import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<Stack>
				<Stack.Screen
					name="(tabs)"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="two-d/history"
					options={{
						title: "2D History",
						headerStyle: {
							backgroundColor: "#0f172a",
						},
						headerTintColor: "#e5e7eb",
						headerTitleStyle: {
							fontWeight: "900",
						},
						headerTitleAlign: "center",
					}}
				/>
				<Stack.Screen
					name="two-d/results-history"
					options={{
						title: "2D Results History",
						headerStyle: {
							backgroundColor: "#0f172a",
						},
						headerTintColor: "#e5e7eb",
						headerTitleStyle: {
							fontWeight: "900",
						},
						headerTitleAlign: "center",
					}}
				/>
			</Stack>
		</SafeAreaProvider>
	);
}
