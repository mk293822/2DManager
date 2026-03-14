// UserTwoDListNumbers.tsx
import { Loading } from "@/components/loading";
import TwoDListsRow from "@/components/two-d-lists/two-d-lists-row";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import { useCalculatedData } from "@/hooks/two-d-list/use-calculated-data";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { chunkIntoPairs } from "@/lib/two-d-list-helper";
import { SectionName } from "@/types/manage-types";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

const UserTwoDListNumbers = () => {
	const { twoDList, fetchTwoDListBySectionSale, loading } =
		useTwoDListsContext();
	const { sections } = useManageContext();
	const { id, user_name, section } = useLocalSearchParams<{
		id: string;
		user_name: string;
		section: SectionName;
	}>();
	const [refreshing, setRefreshing] = useState(false);

	const reset = async () => {
		if (!id) return;
		const controller = new AbortController();

		setRefreshing(true);
		await fetchTwoDListBySectionSale(controller.signal, id);
		setRefreshing(false);
	};

	const numbers = useCalculatedData(
		twoDList?.flatMap((value) => value.numbers_data) || [],
		"all",
		0,
		false,
	);
	const chunkedData = chunkIntoPairs(numbers);

	const renderItem = ({ item }: { item: (typeof chunkedData)[0] }) => (
		<TwoDListsRow
			draw_number={sections?.[0][section]?.draw_number || null}
			left={item.left}
			right={item.right}
		/>
	);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: user_name || "User",
				}}
			/>

			{loading ? (
				<Loading />
			) : !twoDList || twoDList.length === 0 ? (
				<View className="flex-1 items-center justify-center bg-white p-4">
					<Text className="text-gray-500 font-semibold text-center mb-4">
						No data found.
					</Text>
					<Pressable
						onPress={reset}
						className="bg-indigo-600 px-6 py-3 rounded-xl"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				</View>
			) : (
				<FlatList
					data={chunkedData}
					renderItem={renderItem}
					keyExtractor={(_, index) => index.toString()}
					refreshControl={
						<RefreshControl
							colors={["#0000ff"]}
							refreshing={refreshing}
							onRefresh={reset}
						/>
					}
					contentContainerStyle={{ paddingVertical: 20 }}
					ListEmptyComponent={
						<View className="flex-col items-center justify-center h-40">
							<Text className="text-3xl font-bold text-gray-400">
								No Item Exists
							</Text>
						</View>
					}
				/>
			)}
		</>
	);
};

export default UserTwoDListNumbers;
