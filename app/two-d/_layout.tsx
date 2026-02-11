// File: app/two-d/_layout.tsx

import { Stack } from "expo-router";

const headerOptions = {
	headerShown: true,
	headerTitleAlign: "center" as const,
	headerStyle: {
		backgroundColor: "rgba(49, 46, 129, 0.85)",
	},
	headerTintColor: "#e5e7eb",
	headerTitleStyle: {
		fontWeight: "900" as const,
	},
};

const pages: { title: string; name: string }[] = [
	{ title: "2D History", name: "history" },
	{ title: "Results History", name: "results-history" },
	{ title: "3D Results", name: "three-d-result" },
];

export default function TwoDLayout() {
	return (
		<Stack>
			{pages.map((page) => (
				<Stack.Screen
					key={page.name}
					name={page.name}
					options={{
						...headerOptions,
						title: page.title,
					}}
				/>
			))}
		</Stack>
	);
}
