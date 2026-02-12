import ManagePageHeaderRight from "@/components/headers/manage-page-header-right";
import ManagePageContextProvider from "@/contexts/manage-page-context-provider";
import { Stack } from "expo-router";

export default function ManageLayout() {
	return (
		<ManagePageContextProvider>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						title: "Manage",
						headerRight: () => <ManagePageHeaderRight />,
						headerStyle: { backgroundColor: "rgba(49, 46, 129, 0.85)" },
						headerTintColor: "#e5e7eb",
						headerTitleStyle: { fontWeight: "900" },
					}}
				/>
			</Stack>
		</ManagePageContextProvider>
	);
}
