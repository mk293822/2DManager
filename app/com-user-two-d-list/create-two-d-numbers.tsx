import CustomKeyboard from "@/components/custom-keyboard";
import { isNumber } from "@/lib/helpers";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const CreateTwoDNumbersPage = () => {
	const { user_name } = useLocalSearchParams<{ user_name: string }>();
	const [list, setList] = useState<
		| {
				number: string;
				value1: string;
				value2?: number;
		  }[]
		| null
	>(null);

	const [twoDValue, setTwoDValue] = useState("");
	const [amount1Value, setAmount1Value] = useState("");
	const [amount2Value, setAmount2Value] = useState("");

	const onEnter = () => {
		setList((pre) => {
			if (!pre) {
				return [
					{
						number: twoDValue,
						value1: amount1Value,
						value2: Number(amount2Value),
					},
				];
			}

			return [
				...pre,
				{
					number: twoDValue,
					value1: amount1Value,
					value2: Number(amount2Value),
				},
			];
		});
	};

	return (
		<>
			<Stack.Screen options={{ headerTitle: user_name || "User" }} />

			<View className="flex-1 bg-gray-100">
				{list && list.length !== 0 ? (
					<ScrollView
						className="flex-1 pt-6"
						contentContainerStyle={{ paddingBottom: 400 }}
					>
						{list.map((val, ind) => (
							<View
								key={ind}
								className="mx-4 mb-4 bg-white rounded-2xl px-4 py-4 shadow"
								style={{
									shadowColor: "#000",
									shadowOffset: { width: 0, height: 3 },
									shadowOpacity: 0.1,
									shadowRadius: 6,
									elevation: 3,
								}}
							>
								<View className="flex-row items-center justify-between">
									{/* Number Badge */}
									{val.number && (
										<View className="bg-indigo-600 px-4 py-2 rounded-xl">
											<Text className="text-white font-bold text-lg tracking-wider">
												{val.number}
											</Text>
										</View>
									)}

									{/* Amount Section */}
									<View className="flex-row items-center gap-3">
										{/* Value 1 */}
										<View
											className={`${isNumber(val.value1) ? "bg-gray-100" : "bg-green-600"} px-4 py-2 rounded-xl min-w-[70px] items-center`}
										>
											<Text
												className={`${isNumber(val.value1) ? "text-gray-800" : "text-white"}  font-semibold text-base`}
											>
												{val.value1}
											</Text>
										</View>

										{/* Divider */}
										{val.value2 && <View className="h-6 w-[1px] bg-gray-300" />}

										{/* Value 2 */}
										{val.value2 && (
											<View className="bg-gray-100 px-4 py-2 rounded-xl min-w-[70px] items-center">
												<Text className="text-gray-800 font-semibold text-base">
													{val.value2.toLocaleString()}
												</Text>
											</View>
										)}
									</View>
								</View>
							</View>
						))}
						<View className="px-4 w-full mt-2">
							<TouchableOpacity
								onPress={() => setList(null)}
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
		</>
	);
};

export default CreateTwoDNumbersPage;
