import React from "react";
import { Pressable, Text, View } from "react-native";

type BussinessPageType = {
	loading?: boolean;
	error?: string | null;
	onReload?: () => void;
	empty?: boolean;
	emptyMessage?: string;
	children: React.ReactNode;
};

export default function BussinessPage({
	loading,
	error,
	onReload,
	empty,
	emptyMessage,
	children,
}: BussinessPageType) {
	// For headerRight you may need to set via navigation.setOptions in useLayoutEffect

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4">
				<Text className="text-red-600 font-semibold text-center mb-4">
					{error}
				</Text>
				{onReload && (
					<Pressable
						onPress={onReload}
						className="bg-indigo-600 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				)}
			</View>
		);
	}
	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4">
				{/* or your actual <Loading /> component */}
				<Text>Loading...</Text>
			</View>
		);
	}
	if (empty) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 p-4">
				<Text className="text-gray-500 font-semibold text-2xl text-center mb-4">
					{emptyMessage ?? "No data"}
				</Text>
				{onReload && (
					<Pressable
						onPress={onReload}
						className="bg-indigo-600 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				)}
			</View>
		);
	}
	return <>{children}</>;
}
