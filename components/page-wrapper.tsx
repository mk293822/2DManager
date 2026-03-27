import React from "react";
import { Pressable, Text, View } from "react-native";
import { Loading } from "./loading";
import OfflineBanner from "./ui/offline-banner";

type BussinessPageType = {
	loading?: boolean;
	error?: Error | null;
	onReload?: () => void;
	empty?: boolean;
	emptyMessage?: string;
	children: React.ReactNode;
};

export default function PageWrapper({
	loading,
	error,
	onReload,
	empty,
	emptyMessage,
	children,
}: BussinessPageType) {
	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4 mb-12">
				<Text className="text-red-600 font-semibold text-center mb-4">
					{error.message}
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
		return <Loading />;
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
	return (
		<View className="flex-1 bg-gray-100">
			<OfflineBanner />

			{/* existing loading / error / content */}
			{children}
		</View>
	);
}
