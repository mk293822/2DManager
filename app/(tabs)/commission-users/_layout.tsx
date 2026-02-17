// app/manage/layout.tsx
import CommissionPageHeaderRight from "@/components/header-rights/commission-page";
import CommissionUserDetailsHeaderRight from "@/components/header-rights/commission-user-details";
import CommissionUserDataContextProvider from "@/contexts/commission-user-data-context-provider";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function CommissionUsersLayout() {
	return (
		<SafeAreaProvider>
			<CommissionUserDataContextProvider>
				<Stack>
					<Stack.Screen
						name="index"
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
										Commission Users
									</Text>
								</View>
							),
							headerRight: () => <CommissionPageHeaderRight />,
							headerStyle: {
								backgroundColor: "rgba(49, 46, 129, 0.85)",
							},
							headerTintColor: "#e5e7eb",
							headerTitleStyle: { fontWeight: "900" },
						}}
					/>
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
							headerRight: () => <CommissionUserDetailsHeaderRight />,
							headerStyle: {
								backgroundColor: "rgba(49, 46, 129, 0.85)",
							},
							headerTintColor: "#e5e7eb",
							headerTitleStyle: { fontWeight: "900" },
						}}
					/>
				</Stack>
			</CommissionUserDataContextProvider>
		</SafeAreaProvider>
	);
}
