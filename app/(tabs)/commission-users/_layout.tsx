// app/manage/layout.tsx
import CommissionPageHeaderRight from "@/components/header-rights/commission-user";
import CommissionUserHeaderContextProvider from "@/contexts/commission-user-header-provider";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function CommissionUsersLayout() {
	return (
		<SafeAreaProvider>
			<CommissionUserHeaderContextProvider>
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
				</Stack>
			</CommissionUserHeaderContextProvider>
		</SafeAreaProvider>
	);
}
