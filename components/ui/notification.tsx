import { eventBus } from "@/lib/event-bus";
import { EVENT_NAMES } from "@/lib/event-name";
import { Notification, NotificationPayload } from "@/types/event-bus";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";

export const NotificationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	// ===== Event Bus Subscriptions =====
	useEffect(() => {
		// Handler for success notifications
		const notificationHandler = (notif: NotificationPayload) => {
			const id = Date.now();
			setNotifications((prev) => [...prev, { id, ...notif }]);
			setTimeout(() => remove(id), 4000);
		};

		eventBus.on(EVENT_NAMES.NOTIFICATION, notificationHandler);

		return () => {
			eventBus.off(EVENT_NAMES.NOTIFICATION, notificationHandler);
		};
	}, []);

	const remove = (id: number) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<>
			{children}
			<View className="absolute top-14 left-4 right-4 z-50">
				{notifications.map((n) => (
					<NotificationCard
						key={n.id}
						notification={n}
						onClose={() => remove(n.id)}
					/>
				))}
			</View>
		</>
	);
};

export const NotificationCard = ({
	notification,
	onClose,
}: {
	notification: Notification;
	onClose: () => void;
}) => {
	const translateY = useRef(new Animated.Value(-12)).current;
	const opacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 1,
				duration: 180,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: 0,
				duration: 180,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	const theme: {
		bg: string;
		bar: string;
		icon: keyof typeof AntDesign.glyphMap;
		iconColor: string;
	} =
		notification.type === "success"
			? {
					bg: "bg-green-200",
					bar: "bg-green-500",
					icon: "check-circle",
					iconColor: "#16a34a",
				}
			: notification.type === "error"
				? {
						bg: "bg-red-200",
						bar: "bg-red-500",
						icon: "close-circle",
						iconColor: "#dc2626",
					}
				: {
						bg: "bg-indigo-200",
						bar: "bg-indigo-500",
						icon: "info-circle",
						iconColor: "#4f46e5",
					};

	return (
		<Animated.View
			style={{
				opacity,
				transform: [{ translateY }],
				alignSelf: "flex-end",
				width: "78%",
			}}
			className="mb-3"
		>
			<Pressable
				onPress={onClose}
				className={`rounded-2xl shadow-lg flex-row overflow-hidden ${theme.bg}`}
			>
				{/* Accent bar */}
				<View className={`w-1.5 ${theme.bar}`} />

				<View className="flex-row items-start px-4 py-3 gap-3 flex-1">
					<AntDesign
						name={theme.icon}
						size={26}
						color={theme.iconColor}
						style={{ marginTop: 2 }}
					/>

					<View className="flex-1">
						<Text className="text-gray-900 font-semibold text-[15px]">
							{notification.title}
						</Text>

						{notification.description && (
							<Text className="text-gray-600 text-sm mt-1">
								{notification.description}
							</Text>
						)}
					</View>
				</View>
			</Pressable>
		</Animated.View>
	);
};
