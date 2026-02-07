import HapticTab from "@/components/haptic-tab";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, Tabs } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Page {
	name?: string;
	title: string;
	icon: keyof typeof AntDesign.glyphMap;
}

const pages: Page[] = [
	{ name: "index", title: "Home", icon: "home" },
	{ name: "manage", title: "Manage", icon: "appstore" },
	{ name: "history", title: "History", icon: "history" },
	{ name: "profile", title: "Profile", icon: "user" },
];

const TabIcon = ({ title, focused, icon }: Page & { focused: boolean }) => {
	return (
		<View
			className={`${focused ? "bg-gray-500 flex-1 min-w-28 gap-1 overflow-hidden flex flex-row" : "min-w-16"} mt-6 min-h-[4rem] justify-center items-center rounded-full`}
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
						height: 60,
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
							tabBarIcon: ({ focused }) => (
								<TabIcon
									title={page.title}
									icon={page.icon}
									focused={focused}
								/>
							),
							headerStyle: {
								backgroundColor: "#0f172a",
							},
							title: page.title,
							headerTintColor: "#e5e7eb",
							headerTitleStyle: {
								fontWeight: "900",
							},

							headerRight: () => (
								<View className="flex-row gap-2 pr-4 items-center">
									<TouchableOpacity
										activeOpacity={0.5}
										className="p-2 rounded-full"
										onPress={() => router.push("/two-d/results-history")}
									>
										<AntDesign
											name="calendar"
											size={22}
											color="#e5e7eb"
										/>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={0.5}
										className="p-2 rounded-full"
										onPress={() => router.push("/two-d/three-d-result")}
									>
										<Text className="text-2xl font-extrabold text-gray-200">
											3D
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										activeOpacity={0.5}
										className="p-2 rounded-full"
										onPress={() => router.push("/two-d/history")}
									>
										<AntDesign
											name="history"
											size={22}
											color="#e5e7eb"
										/>
									</TouchableOpacity>
								</View>
							),
						}}
					/>
				))}
			</Tabs>
		</SafeAreaProvider>
	);
};

export default _Layout;
