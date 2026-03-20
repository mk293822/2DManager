// UserTwoDList.tsx
import UserTwoDListHeaderRight from "@/components/header-rights/user-two-d-list";
import { Loading } from "@/components/loading";
import PageWrapper from "@/components/page-wrapper";
import { useBussinessUserDetailsContext } from "@/hooks/bussiness-user-details/use-context";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { ENGLISH_TO_BURMESE_MAP } from "@/lib/custom-keyboard-helper";
import { SectionName } from "@/types/manage-types";
import { NumberItem, TwoDListType } from "@/types/two-d-list-types";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

const UserTwoDList = () => {
	const { twoDList, fetchTwoDListBySectionSale, loading, error } =
		useTwoDListsContext();
	const { bussinessUserDetails } = useBussinessUserDetailsContext();
	const { section } = useLocalSearchParams<{
		section: SectionName;
	}>();
	const sectionSale = bussinessUserDetails?.section_sales[section];
	const [refreshing, setRefreshing] = useState(false);

	useAbortableEffect(
		(signal) => {
			if (sectionSale?.id) fetchTwoDListBySectionSale(signal, sectionSale.id);
		},
		[sectionSale],
	);

	if (loading) return <Loading />;

	if (!sectionSale?.id || !section || !twoDList) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4">
				<Text className="text-red-600 font-semibold text-center mb-4">
					Section not found or invalid Section.
				</Text>
			</View>
		);
	}

	const onRefresh = async () => {
		const controller = new AbortController();

		if (!sectionSale?.id) return;
		setRefreshing(true);
		await fetchTwoDListBySectionSale(controller.signal, sectionSale.id);
		setRefreshing(false);
	};

	const renderNumberBox = (val: NumberItem) => {
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

	const renderTwoDItem = ({ item }: { item: TwoDListType }) => {
		const drawTimes = sectionSale.section_summary.draw_times;
		const totalDrawAmount = item.total_draw_value * drawTimes;
		const balance = totalDrawAmount - item.total_amount;

		return (
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

				{/* Voucher-style summary */}
				<View className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
					{/* Total Amount */}
					<View className="flex-row justify-between mb-1">
						<Text className="text-gray-600 font-semibold">Total:</Text>
						<Text className="text-red-600 font-bold">
							{item.total_amount.toLocaleString()}
						</Text>
					</View>

					{/* Total Draw Amount with multiplication */}
					<View className="flex-row justify-between mb-1">
						<Text className="text-gray-600 font-semibold">Total Draw:</Text>
						<Text className="text-green-600 font-bold">
							{item.total_draw_value.toLocaleString()} × {drawTimes} ={" "}
							{totalDrawAmount.toLocaleString()}
						</Text>
					</View>

					<View className="border-t border-dashed border-gray-400 my-2" />

					{/* Balance */}
					<View className="flex-row justify-between">
						<Text className="text-gray-600 font-semibold">Balance:</Text>
						<Text
							className={`${balance > 0 ? "text-green-600" : "text-red-600"} font-bold`}
						>
							{balance.toLocaleString()}
						</Text>
					</View>
				</View>
			</View>
		);
	};
	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: bussinessUserDetails?.name || "User",
					headerRight: () => (
						<UserTwoDListHeaderRight
							id={sectionSale?.id}
							user_name={bussinessUserDetails?.name ?? "User"}
							section={section}
						/>
					),
				}}
			/>

			<PageWrapper
				loading={loading}
				error={error}
				onReload={onRefresh}
				empty={!twoDList || twoDList.length === 0}
				emptyMessage="No 2D list data found."
			>
				<FlatList
					data={twoDList}
					renderItem={renderTwoDItem}
					keyExtractor={(item) => item.id}
					refreshControl={
						<RefreshControl
							colors={["#0000ff"]}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					contentContainerStyle={{
						padding: 16,
						paddingTop: 24,
						paddingBottom: 20,
					}}
				/>
			</PageWrapper>
		</>
	);
};

export default UserTwoDList;
