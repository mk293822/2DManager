// UserTwoDListNumbers.tsx
import { Loading } from "@/components/loading";
import PageWrapper from "@/components/page-wrapper";
import TwoDListsRow from "@/components/two-d-lists/two-d-lists-row";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { useCalculatedNumbersData } from "@/hooks/use-calculated-numbers-data";
import { chunkIntoPairs } from "@/lib/two-d-list-helper";
import { SectionName } from "@/types/manage-types";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

const UserTwoDListNumbers = () => {
	const { twoDList, fetchTwoDListBySectionSale, loading, error } =
		useTwoDListsContext();
	const { sections } = useManageContext();
	const { id, user_name, section } = useLocalSearchParams<{
		id: string;
		user_name: string;
		section: SectionName;
	}>();
	const [refreshing, setRefreshing] = useState(false);
	const numbers = useCalculatedNumbersData(
		twoDList?.flatMap((value) => value.numbers_data) || [],
		"all",
		0,
		false,
	);

	if (loading) return <Loading />;

	if (!id || !user_name || !section || !twoDList) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4">
				<Text className="text-red-600 font-semibold text-center mb-4">
					User not found or invalid ID.
				</Text>
			</View>
		);
	}

	const onRefresh = async () => {
		if (!id) return;
		const controller = new AbortController();

		setRefreshing(true);
		await fetchTwoDListBySectionSale(controller.signal, id);
		setRefreshing(false);
	};

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

			<PageWrapper
				loading={loading}
				error={error}
				onReload={onRefresh}
				empty={!chunkedData || chunkedData.length === 0}
				emptyMessage="No 2D numbers found."
			>
				<FlatList
					data={chunkedData}
					renderItem={renderItem}
					keyExtractor={(_, index) => index.toString()}
					refreshControl={
						<RefreshControl
							colors={["#0000ff"]}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					contentContainerStyle={{ paddingVertical: 20 }}
				/>
			</PageWrapper>
		</>
	);
};

export default UserTwoDListNumbers;
