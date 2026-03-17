import { Loading } from "@/components/loading";
import { EVENT_NAMES } from "@/event-names";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { three_d_api } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import type {
	ThreeDResultItem,
	ThreeDResultResponse,
} from "@/types/two-d-types";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

const ThreeDResult = () => {
	const [refreshing, setRefreshing] = useState(false);
	const [data, setData] = useState<ThreeDResultResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchData = useCallback(
		async (signal: AbortSignal, showLodaing: boolean = true) => {
			try {
				if (showLodaing) setLoading(true);

				const response = await three_d_api.get<ThreeDResultResponse>(
					"/threed-result",
					{ signal },
				);

				setData(response.data);
			} catch (err) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Fetch Error",
					description: JSON.stringify(err) || "Failed to load 3D results",
				});
			} finally {
				if (!signal.aborted) {
					setLoading(false);
				}
			}
		},
		[],
	);

	useAbortableEffect(
		(signal) => {
			fetchData(signal);
		},
		[fetchData],
	);

	const onRefresh = async () => {
		const controller = new AbortController();
		setRefreshing(true);
		await fetchData(controller.signal, false);
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

	if (loading) return <Loading />;

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
