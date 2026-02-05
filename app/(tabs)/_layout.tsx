import HapticTab from "@/components/haptic-tab";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Page {
	name?: string;
	title: string;
	icon: keyof typeof AntDesign.glyphMap;
}

const pages: Page[] = [
	{ name: "index", title: "Home", icon: "home" },
	{ name: "manage", title: "Manage", icon: "setting" },
	{ name: "history", title: "History", icon: "history" },
	{ name: "profile", title: "Profile", icon: "user" },
];

const TabIcon = ({ title, focused, icon }: Page & { focused: boolean }) => {
	return (
		<View
			className={`${focused ? "bg-purple-400 flex-1 min-w-28 gap-1 overflow-hidden flex flex-row" : "min-w-16"} mt-4 min-h-[3.7rem] justify-center items-center rounded-full`}
		>
			<AntDesign
				name={icon}
				size={24}
				color={"white"}
			/>
			{focused && (
				<Text className={`text-base font-bold mt-0.5 text-gray-200`}>
					{title}
				</Text>
			)}
		</View>
	);
};

const _Layout = () => {
	return (
		<SafeAreaProvider>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarShowLabel: false,
					tabBarButton: (props) => <HapticTab {...props} />,
					tabBarItemStyle: {
						justifyContent: "center",
						alignItems: "center",
						width: "auto",
						height: "100%",
					},
					tabBarStyle: {
						borderRadius: 50,
						marginHorizontal: 20,
						marginBottom: 29,
						height: 52,
						position: "absolute",
						overflow: "hidden",
						borderWidth: 1,
						paddingHorizontal: 5,
						backgroundColor: "#1f2937",
						borderColor: "1f2937",
					},
				}}
			>
				{pages.map((page) => (
					<Tabs.Screen
						key={page.name}
						name={page.name}
						options={{
							title: page.title,
							tabBarIcon: ({ focused }) => (
								<TabIcon
									title={page.title}
									icon={page.icon}
									focused={focused}
								/>
							),
						}}
					/>
				))}
			</Tabs>
		</SafeAreaProvider>
	);
};

export default _Layout;
