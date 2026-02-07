import useFetchLiveTwoD from "@/hooks/use-fetch-live-two-d";
import { formatTimeIntl } from "@/lib/time";
import { TwoDData } from "@/types/two-d-types";
import React, { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Text,
	View,
} from "react-native";

const ResultsHistory = () => {
	const { liveData, loading, refetch } = useFetchLiveTwoD<TwoDData[]>(
		"/2d_result",
		{
			interval: false,
		},
	);
	const [refreshing, setRefreshing] = useState(false);

	const renderChild = ({ item }: { item: TwoDData["child"][0] }) => (
		<View className="px-4 py-4 border-b border-gray-200 bg-white">
			<View className="flex-row w-full justify-between mt-3">
				{/* Time */}
				<View className="w-1/4 items-center">
					<Text className="text-xs text-gray-400 uppercase tracking-wide">
						Time
					</Text>
					<Text className="text-lg font-bold text-gray-700">
						{formatTimeIntl(item.time)}
					</Text>
				</View>

				{/* Set */}
				<View className="flex-1 items-center">
					<Text className="text-xs text-gray-400 uppercase tracking-wide">
						Set
					</Text>
					<Text className="text-xl font-bold text-green-600">{item.set}</Text>
				</View>

				{/* Value */}
				<View className="flex-1 items-center">
					<Text className="text-xs text-gray-400 uppercase tracking-wide">
						Value
					</Text>
					<Text className="text-xl font-bold text-green-600">{item.value}</Text>
				</View>

				{/* 2D */}
				<View className="w-1/7 items-center">
					<Text className="text-xs text-gray-400 uppercase tracking-wide">
						2D
					</Text>
					<Text className="text-xl font-bold text-indigo-600">{item.twod}</Text>
				</View>
			</View>
		</View>
	);

	// render each date section
	const renderSection = ({ item }: { item: TwoDData }) => (
		<View className="mb-6 w-full">
			{/* Date Header */}
			<View className="bg-indigo-900/70 px-4 py-2 rounded-t-xl">
				<Text className="text-white font-semibold text-sm">📅 {item.date}</Text>
			</View>

			{/* Result Card */}
			<View className="bg-white rounded-b-xl shadow-md overflow-hidden">
				<FlatList
					data={item.child}
					renderItem={renderChild}
					keyExtractor={(child) => child.time} // better than index
				/>
			</View>
		</View>
	);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	return (
		<View className="flex-1 items-center justify-center">
			{loading ? (
				<ActivityIndicator
					size={50}
					color={"#0000ff"}
					className="my-3"
				/>
			) : (
				<FlatList
					data={liveData || []}
					renderItem={renderSection}
					keyExtractor={(child, index) => `${child.date}-${index}`}
					contentContainerStyle={{
						padding: 16,
						paddingBottom: 32,
						backgroundColor: "#f3f4f6", // gray-100
					}}
					refreshControl={
						<RefreshControl
							colors={["#0000ff"]}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
				/>
			)}
		</View>
	);
};

export default ResultsHistory;
