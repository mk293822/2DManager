import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function CommissionUsersDetailsLayout() {
	return (
		<SafeAreaProvider>
			<Stack>
				<Stack.Screen
					name="[id]"
					options={{
						headerTitle: () => (
							<View
								style={{
									minHeight: 64,
									justifyContent: "center",
									paddingBottom: 6,
								}}
							>
								<Text
									style={{
										color: "#e5e7eb",
										fontWeight: "600",
										fontSize: 20,
									}}
								>
									Commission User
								</Text>
							</View>
						),

						headerStyle: {
							backgroundColor: "rgba(49, 46, 129, 0.85)",
						},
						headerTintColor: "#e5e7eb",
						headerTitleStyle: { fontWeight: "900" },
					}}
				/>
				<Stack.Screen
					name="section-sales"
					options={{
						headerTitle: () => (
							<View
								style={{
									minHeight: 64,
									justifyContent: "center",
									paddingBottom: 6,
								}}
							>
								<Text
									style={{
										color: "#e5e7eb",
										fontWeight: "600",
										fontSize: 20,
									}}
								>
									Section Sales
								</Text>
							</View>
						),

						headerStyle: {
							backgroundColor: "rgba(49, 46, 129, 0.85)",
						},
						headerTintColor: "#e5e7eb",
						headerTitleStyle: { fontWeight: "900" },
					}}
				/>
			</Stack>
		</SafeAreaProvider>
	);
}
