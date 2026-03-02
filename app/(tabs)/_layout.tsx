import HapticTab from "@/components/haptic-tab";
import CommissionUserPageHeaderRight from "@/components/header-rights/commission-user";
import HomePageHeaderRight from "@/components/header-rights/home-page";
import CommissionUserProvider from "@/contexts/commission-user-provider";
import ManageProvider from "@/contexts/manage-provider";
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

const TabIcon = ({ focused, icon }: Page & { focused: boolean }) => {
	return (
		<View
			className={`${focused ? "bg-purple-400 flex-1 min-w-24 gap-1 overflow-hidden flex flex-row" : "min-w-16"} mt-6 min-h-[3.6rem] justify-center items-center rounded-full`}
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
			<ManageProvider>
				<CommissionUserProvider>
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
								paddingHorizontal: 14,
								backgroundColor: "rgba(49, 46, 129, 0.75)",
							},
						}}
					>
						<Tabs.Screen
							name={"index"}
							options={{
								tabBarIcon: ({ focused }) => (
									<TabIcon
										icon={"home"}
										focused={focused}
									/>
								),
								title: "Home",
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
								headerRight: () => <HomePageHeaderRight />,
							}}
						/>

						<Tabs.Screen
							name="two-d-lists"
							options={{
								headerShown: false,
								tabBarIcon: ({ focused }) => (
									<TabIcon
										icon="unordered-list"
										focused={focused}
									/>
								),
							}}
						/>
						<Tabs.Screen
							name="manage"
							options={{
								headerShown: false,
								tabBarIcon: ({ focused }) => (
									<TabIcon
										icon="appstore"
										focused={focused}
									/>
								),
							}}
						/>
						<Tabs.Screen
							name={"commission-users"}
							options={{
								tabBarIcon: ({ focused }) => (
									<TabIcon
										icon={"usergroup-add"}
										focused={focused}
									/>
								),
								title: "Commission Users",
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
								headerRight: () => <CommissionUserPageHeaderRight />,
							}}
						/>

						<Tabs.Screen
							name={"profile"}
							options={{
								tabBarIcon: ({ focused }) => (
									<TabIcon
										icon={"user"}
										focused={focused}
									/>
								),
								title: "Profile",
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
							}}
						/>
					</Tabs>
				</CommissionUserProvider>
			</ManageProvider>
		</SafeAreaProvider>
	);
};

export default TabsLayout;
