// app/manage/layout.tsx
import ManagePageHeaderRight from "@/components/header-rights/manage-page";
import ManagePageToggleContextProvider from "@/contexts/manage/data-context-provider";
import ManagePageDataContextProvider from "@/contexts/manage/toggle-context-provider";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ManageLayout() {
	return (
		<SafeAreaProvider>
			<ManagePageToggleContextProvider>
				<ManagePageDataContextProvider>
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
											Manage
										</Text>
									</View>
								),
								headerRight: () => <ManagePageHeaderRight />,
								headerStyle: {
									backgroundColor: "rgba(49, 46, 129, 0.85)",
								},
								headerTintColor: "#e5e7eb",
								headerTitleStyle: { fontWeight: "900" },
							}}
						/>
					</Stack>
				</ManagePageDataContextProvider>
			</ManagePageToggleContextProvider>
		</SafeAreaProvider>
	);
}
