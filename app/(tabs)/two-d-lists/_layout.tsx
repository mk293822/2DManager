// app/manage/layout.tsx
import TwoDListsHeaderRight from "@/components/header-rights/two-d-lists";
import TwoDListsHeaderContextProvider from "@/contexts/two-d-lists-header-provider";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TwoDListLayout() {
	return (
		<SafeAreaProvider>
			<TwoDListsHeaderContextProvider>
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
										2D Lists
									</Text>
								</View>
							),
							headerRight: () => <TwoDListsHeaderRight />,
							headerStyle: {
								backgroundColor: "rgba(49, 46, 129, 0.85)",
							},
							headerTintColor: "#e5e7eb",
							headerTitleStyle: { fontWeight: "900" },
						}}
					/>
				</Stack>
			</TwoDListsHeaderContextProvider>
		</SafeAreaProvider>
	);
}
