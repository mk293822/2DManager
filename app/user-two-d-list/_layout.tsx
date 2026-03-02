import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="[id]"
					options={{
						headerTitle: () => (
							<View style={{ minHeight: 64, justifyContent: "center" }}>
								<Text
									style={{
										color: "#e5e7eb",
										fontWeight: "600",
										fontSize: 20,
									}}
								>
									2D List Details
								</Text>
							</View>
						),
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
			</Stack>
		</SafeAreaProvider>
	);
}
