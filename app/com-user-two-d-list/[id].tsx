// UserTwoDList.tsx
import UserTwoDListHeaderRight from "@/components/header-rights/user-two-d-list";
import { Loading } from "@/components/loading";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { ENGLISH_TO_BURMESE_MAP } from "@/lib/custom-keyboard-helper";
import { SoldNumberItem, TwoDListType } from "@/types/two-d-list-types";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

const UserTwoDList = () => {
	const { twoDList, fetchTwoDListBySectionSale, loading } =
		useTwoDListsContext();
	const { id, user_name } = useLocalSearchParams<{
		id: string;
		user_name: string;
	}>();
	const [refreshing, setRefreshing] = useState(false);

	useAbortableEffect(
		(signal) => {
			if (id) fetchTwoDListBySectionSale(signal, id);
		},
		[id],
	);

	const reset = async () => {
		if (!id) return;
		setRefreshing(true);
		await fetchTwoDListBySectionSale(new AbortController().signal, id);
		setRefreshing(false);
	};

	const renderNumberBox = (val: SoldNumberItem) => {
		if (val.type === "normal" && val.number) {
			return (
				<View className="bg-indigo-600 px-4 py-2 rounded-xl">
					<Text className="text-white font-bold text-lg tracking-wider">
						{val.number}
					</Text>
				</View>
			);
		}
		if (val.type === "special_group" && val.value) {
			return (
				<View className="bg-green-600 px-4 py-2 rounded-xl">
					<Text className="text-white font-bold text-lg tracking-wider">
						{ENGLISH_TO_BURMESE_MAP[val.value]}
					</Text>
				</View>
			);
		}
		if (val.type === "digit_related" && val.number && val.value) {
			return (
				<View className="bg-yellow-600 px-4 py-2 rounded-xl">
					<Text className="text-white font-bold text-lg tracking-wider">
						{val.number} - {ENGLISH_TO_BURMESE_MAP[val.value]}
					</Text>
				</View>
			);
		}
		return null;
	};

	const renderAmountBox = (amount: number | undefined) => {
		return (
			<View className="bg-gray-100 px-4 py-2 rounded-xl min-w-[70px] items-center">
				<Text className="text-gray-800 font-semibold text-base">
					{Number(amount).toLocaleString()}
				</Text>
			</View>
		);
	};

	const renderTwoDItem = ({ item }: { item: TwoDListType }) => (
		<View
			key={item.id}
			className="mb-6 bg-white rounded-2xl px-4 py-4 shadow"
			style={{
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 3 },
				shadowOpacity: 0.1,
				shadowRadius: 6,
				elevation: 3,
			}}
		>
			<Text className="text-gray-500 text-md mb-4 text-center">
				Created: {new Date(item.created_at).toLocaleTimeString()}
			</Text>

			{item.numbers_data.map((val, ind) => (
				<View
					key={ind}
					className="mb-3 rounded-2xl bg-gray-200 p-3 shadow-sm"
				>
					<View className="flex-row items-center justify-between">
						{renderNumberBox(val)}
						<View className="flex-row items-center gap-3">
							{renderAmountBox(val.amount1)}

							{val.amount1 != null &&
								val.amount2 != null &&
								val.amount2 !== 0 && (
									<View className="h-6 w-[1px] border-r border-gray-400" />
								)}

							{val.amount2 != null &&
								val.amount2 !== 0 &&
								renderAmountBox(val.amount2)}
						</View>
					</View>
				</View>
			))}
		</View>
	);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: user_name || "User",
					headerRight: () => (
						<UserTwoDListHeaderRight
							id={id}
							user_name={user_name}
						/>
					),
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
					data={twoDList}
					renderItem={renderTwoDItem}
					keyExtractor={(item) => item.id}
					refreshControl={
						<RefreshControl
							colors={["#0000ff"]}
							refreshing={refreshing}
							onRefresh={reset}
						/>
					}
					contentContainerStyle={{
						padding: 16,
						paddingTop: 24,
						paddingBottom: 20,
					}}
				/>
			)}
		</>
	);
};

export default UserTwoDList;
