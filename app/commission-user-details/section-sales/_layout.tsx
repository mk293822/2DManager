// app/manage/layout.tsx
import SectionSalesHeaderRight from "@/components/header-rights/section-sales";
import ToggleContextProvider from "@/contexts/toggle-provider";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function CommissionUsersDetailsLayout() {
	return (
		<SafeAreaProvider>
			<ToggleContextProvider>
				<Stack>
					<Stack.Screen
						name="index"
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
							headerRight: () => <SectionSalesHeaderRight />,
						}}
					/>
				</Stack>
			</ToggleContextProvider>
		</SafeAreaProvider>
	);
}
