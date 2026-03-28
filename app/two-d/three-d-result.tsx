// file: components/ThreeDResult.tsx
import PageWrapper from "@/components/page-wrapper";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { three_d_api } from "@/lib/api";
import { formatDateDisplay } from "@/lib/datetime-helper";
import type {
	ThreeDResultItem,
	ThreeDResultResponse,
} from "@/types/two-d-types";
import { isAxiosError } from "axios";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

const ThreeDResult = () => {
	const [refreshing, setRefreshing] = useState(false);
	const [data, setData] = useState<ThreeDResultResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(
		async (signal: AbortSignal, showLoading: boolean = true) => {
			if (signal.aborted) return;

			try {
				if (showLoading) setLoading(true);
				setError(null);

				const response = await three_d_api.get<ThreeDResultResponse>(
					"/threed-result",
					{ signal },
				);

				setData(response.data);
			} catch (err: unknown) {
				if (signal.aborted) return;

				let message = "Something went wrong!";
				if (isAxiosError(err)) {
					if (err.response) {
						message = err.response.data?.detail || err.message;
					} else if (err.request) {
						message = "Network error. Please check your connection.";
					} else {
						message = err.message;
					}
				} else if (err instanceof Error) {
					message = err.message;
				}

				setError(new Error(message));
			} finally {
				if (!signal.aborted) setLoading(false);
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

	const refetch = async (showLoading: boolean = false) => {
		const controller = new AbortController();
		await fetchData(controller.signal, showLoading);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch(false);
		setRefreshing(false);
	};

	const renderItem = ({ item }: { item: ThreeDResultItem }) => (
		<View className="bg-white rounded-2xl px-4 py-6 mb-4 shadow-md">
			<Text className="text-4xl font-extrabold text-center tracking-widest text-gray-900">
				{item.result}
			</Text>
			<View className="mt-4 pt-3 border-t border-gray-200">
				<Text className="text-sm text-center text-gray-500">
					{formatDateDisplay(new Date(item.datetime))}
				</Text>
			</View>
		</View>
	);

	return (
		<PageWrapper
			loading={loading}
			error={error}
			onReload={() => refetch(true)}
			empty={!loading && (!data || data.data.length === 0)}
			emptyMessage="No results found!"
		>
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
		</PageWrapper>
	);
};

export default ThreeDResult;
