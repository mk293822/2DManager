// CreateTwoDNumbersPage.tsx
import CustomKeyboard from "@/components/custom-keyboard";
import CreateTwoDNumbersHeaderRight from "@/components/header-rights/create-two-d-numbers";
import PageWrapper from "@/components/page-wrapper";
import { EVENT_NAMES } from "@/event-names";
import { useBussinessUserDetailsContext } from "@/hooks/bussiness-user-details/use-context";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import {
	ENGLISH_TO_BURMESE_MAP,
	SPECIAL_KEYS1,
	SPECIAL_KEYS2,
} from "@/lib/custom-keyboard-helper";
import { eventBus } from "@/lib/event-bus";
import { SectionName } from "@/types/manage-types";
import {
	DigitRelatedItem,
	NormalItem,
	NumberItem,
	SpecialGroupItem,
} from "@/types/two-d-list-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const CreateTwoDNumbersPage = () => {
	const {
		bussinessUserDetails: user,
		error,
		loading,
		reset,
	} = useBussinessUserDetailsContext();
	const { section } = useLocalSearchParams<{ section: SectionName }>();
	const section_sale = user?.section_sales?.[section];

	const [list, setList] = useState<NumberItem[] | null>(null);
	const { handleCreateTwoDList } = useTwoDListsContext();

	const [twoDValue, setTwoDValue] = useState<string>("");
	const [amount1Value, setAmount1Value] = useState<string>("");
	const [amount2Value, setAmount2Value] = useState<string>("");

	const deleteItem = (index: number) => {
		setList((prev) => prev?.filter((_, i) => i !== index) || null);
	};

	const onEnter = () => {
		let err = "";

		if (!twoDValue.trim()) err = "Two-D field is required!";
		else if (SPECIAL_KEYS1.includes(twoDValue)) {
			if (!amount1Value) err = "Amount 1 field is required!";
			if (amount2Value.trim()) err = "Amount 2 field is not required!";
		} else if (SPECIAL_KEYS2.includes(amount1Value)) {
			if (twoDValue.length > 1)
				err = "Two-D value can't be more than one digit!";
			if (!amount2Value) err = "Amount 2 field is required!";
		} else {
			if (!amount1Value && !amount2Value.trim())
				err = "At least 1 amount field is required!";
		}

		if (err) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Field Error!",
				description: err,
				type: "error",
			});
			return;
		}

		let value: NumberItem;
		if (SPECIAL_KEYS1.includes(twoDValue)) {
			value = {
				type: "special_group",
				value: twoDValue,
				amount1: Number(amount1Value) ?? 0,
			} as SpecialGroupItem;
		} else if (SPECIAL_KEYS2.includes(amount1Value)) {
			value = {
				type: "digit_related",
				number: twoDValue.charAt(0),
				value: amount1Value,
				amount1: Number(amount2Value) ?? 0,
			} as DigitRelatedItem;
		} else {
			value = {
				type: "normal",
				number: twoDValue,
				amount1: Number(amount1Value) ?? 0,
				amount2: Number(amount2Value) ?? 0,
			} as NormalItem;
		}

		setList((prev) => (prev ? [...prev, value] : [value]));
	};

	const handleAdd = async () => {
		if (!list || !section_sale || !user) return;
		await handleCreateTwoDList(
			section_sale.id,
			list,
			section_sale.section_summary.id,
			user.id,
			section,
			user.id,
		);
		setList(null);
	};

	const onReload = () => {
		if (user) reset(user.id);
	};

	const renderItem = ({ item, index }: { item: NumberItem; index: number }) => (
		<View
			key={index}
			className="mx-4 mb-6 bg-white rounded-2xl px-4 py-4 shadow relative"
			style={{
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 3 },
				shadowOpacity: 0.1,
				shadowRadius: 6,
				elevation: 3,
			}}
		>
			<TouchableOpacity
				onPress={() => deleteItem(index)}
				className="absolute -top-3 -right-1 z-50 bg-red-500 w-7 h-7 rounded-full items-center justify-center"
				activeOpacity={0.8}
			>
				<AntDesign
					name="close"
					size={10}
					color="white"
				/>
			</TouchableOpacity>

			<View className="flex-row items-center justify-between">
				{item.type === "normal" && item.number && (
					<View className="bg-indigo-600 px-4 py-2 rounded-xl">
						<Text className="text-white font-bold text-lg tracking-wider">
							{item.number}
						</Text>
					</View>
				)}
				{item.type === "special_group" && item.value && (
					<View className="bg-green-600 px-4 py-2 rounded-xl">
						<Text className="text-white font-bold text-lg tracking-wider">
							{ENGLISH_TO_BURMESE_MAP[item.value]}
						</Text>
					</View>
				)}
				{item.type === "digit_related" && item.number && item.value && (
					<View className="bg-yellow-600 px-4 py-2 rounded-xl">
						<Text className="text-white font-bold text-lg tracking-wider">
							{item.number} - {ENGLISH_TO_BURMESE_MAP[item.value]}
						</Text>
					</View>
				)}

				<View className="flex-row items-center gap-3">
					{item.amount1 !== undefined && (
						<View className="bg-gray-100 px-4 py-2 rounded-xl min-w-[70px] items-center">
							<Text className="text-gray-800 font-semibold text-base">
								{Number(item.amount1).toLocaleString()}
							</Text>
						</View>
					)}
					{item.amount1 !== undefined && item.amount2 !== undefined && (
						<View className="h-6 w-[1px] bg-gray-300" />
					)}
					{item.amount2 !== undefined && (
						<View className="bg-gray-100 px-4 py-2 rounded-xl min-w-[70px] items-center">
							<Text className="text-gray-800 font-semibold text-base">
								{Number(item.amount2).toLocaleString()}
							</Text>
						</View>
					)}
				</View>
			</View>
		</View>
	);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: user?.name || "User",
					headerRight: () =>
						section_sale && (
							<CreateTwoDNumbersHeaderRight
								id={section_sale.id}
								user_name={user?.name || ""}
							/>
						),
				}}
			/>

			<PageWrapper
				loading={loading}
				error={error}
				onReload={onReload}
				empty={!user || !section_sale}
				emptyMessage="Something went wrong!"
			>
				<FlatList
					data={list}
					renderItem={renderItem}
					keyExtractor={(_, index) => index.toString()}
					contentContainerStyle={{ paddingBottom: 420, paddingTop: 16 }}
					ListEmptyComponent={
						<View
							style={{
								paddingTop: 220,
							}}
						>
							<Text className="text-gray-500 text-xl font-bold text-center">
								No Item Yet
							</Text>
						</View>
					}
					ListFooterComponent={
						<View className="px-4 w-full mt-2">
							{list && list.length > 0 && (
								<TouchableOpacity
									onPress={handleAdd}
									activeOpacity={0.85}
									className="bg-indigo-600 py-3 rounded-xl shadow flex-row gap-2 items-center justify-center"
								>
									<AntDesign
										name="plus"
										color="#fff"
										size={15}
									/>
									<Text className="text-white font-semibold text-center">
										Add
									</Text>
								</TouchableOpacity>
							)}
						</View>
					}
				/>

				<CustomKeyboard
					twoDValue={twoDValue}
					amount1Value={amount1Value}
					amount2Value={amount2Value}
					setTwoDValue={setTwoDValue}
					setAmount1Value={setAmount1Value}
					setAmount2Value={setAmount2Value}
					onEnter={onEnter}
				/>
			</PageWrapper>
		</>
	);
};

export default CreateTwoDNumbersPage;
