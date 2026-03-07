import { Loading } from "@/components/loading";
import TwoDListsRow from "@/components/two-d-lists/two-d-lists-row";
import { useCalculatedData } from "@/hooks/two-d-list/use-calculated-data";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { chunkIntoPairs } from "@/lib/two-d-list-helper";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const UserTwoDListNumbers = () => {
	const { twoDList, fetchTwoDListBySectionSale, loading } =
		useTwoDListsContext();
	const { id, user_name } = useLocalSearchParams<{
		id: string;
		user_name: string;
	}>();

	const reset = () => {
		if (id) fetchTwoDListBySectionSale(new AbortController().signal, id);
	};

	const numbers = useCalculatedData(
		twoDList?.flatMap((value) => value.numbers_data) || [],
	);

	const chunkedData = chunkIntoPairs(numbers);

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
				<ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
					{chunkedData.length > 0 ? (
						chunkedData.map((pair, index) => (
							<TwoDListsRow
								key={index}
								left={pair.left}
								right={pair.right}
							/>
						))
					) : (
						<View className="flex-col items-center justify-center h-40">
							<Text className="text-3xl font-bold text-gray-400">
								No Item Exists
							</Text>
						</View>
					)}
				</ScrollView>
			)}
		</>
	);
};

export default UserTwoDListNumbers;
