// UserTwoDList.tsx
import { Loading } from "@/components/loading";
import TwoDListsRow from "@/components/two-d-lists/two-d-lists-row";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { chunkIntoPairs } from "@/lib/helpers";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const UserTwoDList = () => {
	const { twoDList, fetchTwoDListBySectionSale, loading } =
		useTwoDListsContext();
	const { id, user_name } = useLocalSearchParams<{
		id: string;
		user_name: string;
	}>();
	const router = useRouter();

	useAbortableEffect(
		(signal) => {
			if (id) fetchTwoDListBySectionSale(signal, id);
		},
		[id],
	);

	const reset = () => {
		if (id) {
			fetchTwoDListBySectionSale(new AbortController().signal, id);
		}
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: user_name || "User",
					headerRight: () => {
						return (
							<TouchableOpacity
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								style={{
									padding: 6,
									borderRadius: 999,
								}}
								onPress={() => {
									router.push({
										pathname: "/com-user-two-d-list/create-two-d-numbers",
										params: { id, user_name },
									});
								}}
							>
								<AntDesign
									name="plus"
									size={22}
									color="#fff"
								/>
							</TouchableOpacity>
						);
					},
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
				<ScrollView className="flex-1 bg-gray-100 px-4 pt-6">
					{twoDList.map((item) => {
						const formatted = item.numbers_data.map((n) => ({
							number: n.number,
							value: n.total_amount,
						}));
						const date = new Date(item.created_at);

						const pairs = chunkIntoPairs(formatted);

						return (
							<View
								key={item.id}
								className="bg-gray-50 rounded-3xl py-4 mb-4 border border-gray-200"
							>
								{/* Time Header */}
								<Text className="text-md px-4 font-semibold text-gray-600 mb-4 text-center">
									{date.toLocaleTimeString()}
								</Text>

								{/* Rows */}
								{pairs.map((pair, index) => (
									<TwoDListsRow
										key={index}
										left={pair.left}
										right={pair.right}
									/>
								))}
							</View>
						);
					})}
				</ScrollView>
			)}
		</>
	);
};

export default UserTwoDList;
