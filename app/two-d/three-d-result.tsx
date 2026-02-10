import { three_d_api } from "@/lib/api";
import type {
	ThreeDResultItem,
	ThreeDResultResponse,
} from "@/types/two-d-types";
import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Text,
	View,
} from "react-native";

const ThreeDResult = () => {
	const [refreshing, setRefreshing] = useState(false);
	const [data, setData] = useState<ThreeDResultResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response =
				await three_d_api.get<ThreeDResultResponse>("/threed-result");

			setData(response.data);
		} catch (err) {
			setError("Failed to load 3D results");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchData();
		setRefreshing(false);
	};

	const renderItem = ({ item }: { item: ThreeDResultItem }) => (
		<View className="bg-white rounded-2xl px-4 py-6 mb-4 shadow-md">
			<Text className="text-4xl font-extrabold text-center tracking-widest text-gray-900">
				{item.result}
			</Text>

			<View className="mt-4 pt-3 border-t border-gray-200">
				<Text className="text-sm text-center text-gray-500">
					{item.datetime}
				</Text>
			</View>
		</View>
	);

	if (loading)
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator
					size={50}
					color={"#0000ff"}
					className="my-3"
				/>
			</View>
		);

	return (
		<View className="flex-1 bg-gray-100 px-4 pt-6">
			<FlatList
				data={data?.data ?? []}
				keyExtractor={(item) => item.datetime}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						colors={["#0000ff"]}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			/>
		</View>
	);
};

export default ThreeDResult;
