import HapticTab from "@/components/haptic-tab";
import CommissionPageHeaderRight from "@/components/headers/commission-page-header-right";
import HomePageHeaderRight from "@/components/headers/home-page-header-right";
import ManagePageHeaderRight from "@/components/headers/manage-page-header-right";
import TwoDListsHeaderRight from "@/components/headers/two-d-lists-header-right";
import { useAuthContext } from "@/hooks/use-auth-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Page {
	name?: string;
	title?: string;
	icon: keyof typeof AntDesign.glyphMap;
	headerRight?: () => React.ReactNode;
}

const pages: Page[] = [
	{
		name: "index",
		title: "Home",
		icon: "home",
		headerRight: () => <HomePageHeaderRight />,
	},
	{
		name: "two-d-lists",
		title: "2D Lists",
		icon: "unordered-list",
		headerRight: () => <TwoDListsHeaderRight />,
	},
	{
		name: "manage",
		title: "Manage",
		icon: "appstore",
		headerRight: () => <ManagePageHeaderRight />,
	},
	{
		name: "commission-users",
		title: "Cormission Users",
		icon: "usergroup-add",
		headerRight: () => <CommissionPageHeaderRight />,
	},
	{ name: "profile", title: "Profile", icon: "user" },
];

const TabIcon = ({ focused, icon }: Page & { focused: boolean }) => {
	return (
		<View
			className={`${focused ? "bg-purple-400 flex-1 min-w-24 gap-1 overflow-hidden flex flex-row" : "min-w-16"} mt-6 min-h-[4.2rem] justify-center items-center rounded-full`}
		>
			<AntDesign
				name={icon}
				size={24}
				color={"white"}
			/>
		</View>
	);
};

const TabsLayout = () => {
	const { authLoading, isAuthenticated } = useAuthContext();
	const router = useRouter();

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.replace("/login");
		}
	}, [authLoading, isAuthenticated]);

	if (authLoading || !isAuthenticated) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100">
				<ActivityIndicator
					size={50}
					color="#2563eb"
				/>
			</View>
		);
	}
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
						marginBottom: 30,
						height: 60,
						position: "absolute",
						overflow: "hidden",
						borderWidth: 1,
						paddingHorizontal: 9,
						backgroundColor: "rgba(49, 46, 129, 0.75)",
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
									icon={page.icon}
									focused={focused}
								/>
							),
							title: page.title,
							headerStyle: {
								backgroundColor: "rgba(49, 46, 129, 0.85)",
							},

							headerTintColor: "#e5e7eb",
							headerTitleStyle: {
								fontWeight: "900",
							},

							headerRightContainerStyle: {
								display: "flex",
								alignItems: "center",
							},
							headerRight: page.headerRight,
						}}
					/>
				))}
			</Tabs>
		</SafeAreaProvider>
	);
};

export default TabsLayout;
