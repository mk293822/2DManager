import { NotificationProvider } from "@/components/ui/notification";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

type Screen = {
	name: string;
	title: string;
};

const screens: Screen[] = [
	{
		name: "two-d/history",
		title: "2D History",
	},
	{
		name: "two-d/results-history",
		title: "2D Results History",
	},
	{
		name: "two-d/three-d-result",
		title: "3D Results History",
	},
];

export default function RootLayout() {
	return (
		<NotificationProvider>
			<SafeAreaProvider>
				<Stack>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>
					{screens.map((screen, index) => (
						<Stack.Screen
							key={index}
							name={screen.name}
							options={{
								title: screen.title,
								headerStyle: {
									backgroundColor: "rgba(49, 46, 129, 0.85)",
								},

								headerTintColor: "#e5e7eb",
								headerTitleStyle: {
									fontWeight: "900",
								},
								headerTitleAlign: "center",
							}}
						/>
					))}
				</Stack>
			</SafeAreaProvider>
		</NotificationProvider>
	);
}
