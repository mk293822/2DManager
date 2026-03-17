import CustomKeyboard from "@/components/custom-keyboard";
import CreateTwoDNumbersHeaderRight from "@/components/header-rights/create-two-d-numbers";
import { Loading } from "@/components/loading";
import { EVENT_NAMES } from "@/event-names";
import { useBussinessUserDetailsContext } from "@/hooks/bussiness-user-details/use-context";
import { useManageContext } from "@/hooks/manage/use-manage-context";
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
import React, { useRef, useState } from "react";
import {
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const CreateTwoDNumbersPage = () => {
	const scrollRef = useRef(null);
	const {
		bussinessUserDetails: user,
		error,
		loading,
		reset,
		fetchBussinessUserDetails,
	} = useBussinessUserDetailsContext();
	const { section } = useLocalSearchParams<{
		section: SectionName;
	}>();
	const abordController = new AbortController();

	const section_sale = user?.section_sales?.[section];

	const [list, setList] = useState<NumberItem[] | null>(null);
	const { handleCreateTwoDList } = useTwoDListsContext();
	const { fetchSection } = useManageContext();

	const [twoDValue, setTwoDValue] = useState<string>("");
	const [amount1Value, setAmount1Value] = useState<string>("");
	const [amount2Value, setAmount2Value] = useState("");

	const deleteItem = (index: number) => {
		setList((prev) => {
			if (!prev) return prev;
			return prev.filter((_, i) => i !== index);
		});
	};

	React.useEffect(() => {
		if (list?.length && scrollRef.current) {
			// @ts-ignore
			scrollRef.current.scrollToEnd({ animated: true });
		}
	}, [list]);

	const onEnter = () => {
		let err = "";

		if (!twoDValue.trim()) {
			err = "Two-D field is required!";
		} else if (SPECIAL_KEYS1.includes(twoDValue)) {
			if (!amount1Value) err = "Amount 1 field is required!";
			if (amount2Value.trim()) err = "Amount 2 field is not required!";
		} else if (SPECIAL_KEYS2.includes(amount1Value)) {
			if (twoDValue.split("").length > 1)
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
		setList((pre) => {
			if (!pre) return [value];

			return [...pre, value];
		});
	};

	const handleAdd = async () => {
		if (!list || !section_sale || !user) return;
		await handleCreateTwoDList(
			section_sale.id,
			list,
			section_sale?.section_summary.id,
			user.id,
			section,
		);
		await fetchSection(abordController.signal, {
			type: "day",
			date: new Date(),
		});
		await fetchBussinessUserDetails(abordController.signal, user.id);
		setList(null);
	};

	if (!user || !section_sale)
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-center text-2xl font-bold text-gray-400">
					Something went wrong!{JSON.stringify(user)}
				</Text>
			</View>
		);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: user?.name || "User",
					headerRight: () => (
						<CreateTwoDNumbersHeaderRight
							id={section_sale.id}
							user_name={user.name}
						/>
					),
				}}
			/>
			{error ? (
				<View className="flex-1 items-center justify-center bg-white p-4">
					<Text className="text-red-600 font-semibold text-center mb-4">
						{error}
					</Text>
					<Pressable
						onPress={() => reset(user.id)}
						className="bg-indigo-600 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				</View>
			) : loading ? (
				<Loading />
			) : (
				<View className="flex-1 bg-gray-100">
					{list && list.length !== 0 ? (
						<ScrollView
							ref={scrollRef}
							className="flex-1 pt-6"
							contentContainerStyle={{ paddingBottom: 420 }}
						>
							{list.map((val, ind) => (
								<View
									key={ind}
									className="mx-4 mb-6 bg-white rounded-2xl px-4 py-4 shadow relative"
									style={{
										shadowColor: "#000",
										shadowOffset: { width: 0, height: 3 },
										shadowOpacity: 0.1,
										shadowRadius: 6,
										elevation: 3,
									}}
								>
									{/* Delete Button */}
									<TouchableOpacity
										onPress={() => deleteItem(ind)}
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
										{/* Display number/value */}
										{val.type === "normal" && val.number && (
											<View className="bg-indigo-600 px-4 py-2 rounded-xl">
												<Text className="text-white font-bold text-lg tracking-wider">
													{val.number}
												</Text>
											</View>
										)}

										{val.type === "special_group" && val.value && (
											<View className="bg-green-600 px-4 py-2 rounded-xl">
												<Text className="text-white font-bold text-lg tracking-wider">
													{ENGLISH_TO_BURMESE_MAP[val.value]}
												</Text>
											</View>
										)}

										{val.type === "digit_related" &&
											val.number &&
											val.value && (
												<View className="bg-yellow-600 px-4 py-2 rounded-xl">
													<Text className="text-white font-bold text-lg tracking-wider">
														{val.number} - {ENGLISH_TO_BURMESE_MAP[val.value]}
													</Text>
												</View>
											)}

										{/* Amount Section */}
										<View className="flex-row items-center gap-3">
											{val.amount1 !== undefined && (
												<View className="bg-gray-100 px-4 py-2 rounded-xl min-w-[70px] items-center">
													<Text className="text-gray-800 font-semibold text-base">
														{Number(val.amount1).toLocaleString()}
													</Text>
												</View>
											)}

											{val.amount1 !== undefined &&
												val.amount2 !== undefined && (
													<View className="h-6 w-[1px] bg-gray-300" />
												)}

											{val.amount2 !== undefined && (
												<View className="bg-gray-100 px-4 py-2 rounded-xl min-w-[70px] items-center">
													<Text className="text-gray-800 font-semibold text-base">
														{Number(val.amount2).toLocaleString()}
													</Text>
												</View>
											)}
										</View>
									</View>
								</View>
							))}
							<View className="px-4 w-full mt-2">
								<TouchableOpacity
									onPress={handleAdd}
									activeOpacity={0.85}
									className="bg-indigo-600 py-3 rounded-xl shadow flex-row gap-2 items-center justify-center"
								>
									<AntDesign
										name="plus"
										color={"#fff"}
										size={15}
									/>
									<Text className="text-white font-semibold text-center">
										Add
									</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					) : (
						<View
							style={{
								paddingTop: 220,
							}}
						>
							<Text className="text-gray-500 text-xl font-bold text-center">
								No Item Yet
							</Text>
						</View>
					)}

					<CustomKeyboard
						twoDValue={twoDValue}
						amount1Value={amount1Value}
						amount2Value={amount2Value}
						setTwoDValue={setTwoDValue}
						setAmount1Value={setAmount1Value}
						setAmount2Value={setAmount2Value}
						onEnter={onEnter}
					/>
				</View>
			)}
		</>
	);
};

export default CreateTwoDNumbersPage;
