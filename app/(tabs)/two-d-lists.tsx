// TwoDLists.tsx
import HolidayInfo from "@/components/holiday-info";
import TwoDListsRow from "@/components/two-d-lists-row";
import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

// Generate random data as a single value per item
const generateData = () => {
	const data = [];
	for (let i = 0; i < 100; i++) {
		const value = Math.floor(Math.random() * (1_500 - 100 + 1) + 100);
		data.push({
			number: i.toString().padStart(2, "0"),
			value,
		});
	}
	return data;
};

type filterModeType = "all" | "exceed" | "not-exceed";

const TwoDLists = () => {
	const data = generateData();
	const [filterMode, setFilterMode] = useState<filterModeType>("all");
	const [limit, setLimit] = useState<number>(1000);
	const [inputValue, setInputValue] = useState(limit.toString());
	const isHoliday = false;

	// Filtered data based on mode
	const filteredData = data.filter((item) => {
		if (filterMode === "all") return true;
		if (filterMode === "exceed") return item.value > limit;
		if (filterMode === "not-exceed") return item.value <= limit;
		return true;
	});

	// Chunk filteredData into pairs safely
	const chunkedData: { left: (typeof data)[0]; right?: (typeof data)[0] }[] =
		[];

	for (let i = 0; i < filteredData.length; i += 2) {
		const left = filteredData[i];
		const right = filteredData[i + 1]; // might be undefined
		chunkedData.push({ left, right }); // always push left, right optional
	}

	return (
		<View className="flex-col">
			{isHoliday && <HolidayInfo />}

			{/* Filter buttons and limit input */}
			<View className="mx-4 mt-2 mb-2 flex-row justify-between items-center">
				<View className="flex-row gap-2">
					<TouchableOpacity
						onPress={() => setFilterMode("all")}
						className={`px-3 w-16 py-1 h-12 rounded-full items-center justify-center ${
							filterMode === "all" ? "bg-indigo-700" : "bg-indigo-900/60"
						}`}
					>
						<Text className="text-white text-center font-semibold text-sm">
							All
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setFilterMode("exceed")}
						className={`px-3 py-1 h-12 rounded-full items-center justify-center ${
							filterMode === "exceed" ? "bg-indigo-700" : "bg-indigo-900/60"
						}`}
					>
						<Text className="text-white text-center font-semibold text-sm">
							Exceed
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setFilterMode("not-exceed")}
						className={`px-3 py-1 h-12 rounded-full items-center justify-center ${
							filterMode === "not-exceed" ? "bg-indigo-700" : "bg-indigo-900/60"
						}`}
					>
						<Text className="text-white text-center font-semibold text-sm">
							Not Exceed
						</Text>
					</TouchableOpacity>
				</View>

				<View className="flex-row items-center gap-1 bg-indigo-900/60 pl-3 rounded-full">
					<Text className="text-white font-semibold text-sm">Limit:</Text>
					<TextInput
						className="min-w-24 max-w-28 h-12 text-center bg-indigo-900/70 rounded-full text-white items-center justify-center font-semibold text-sm"
						value={inputValue.toString()}
						onChangeText={(text) => setInputValue(text)} // update temp state on typing
						onSubmitEditing={() => {
							const num = Number(inputValue);
							setLimit(num ? num : 1000); // update actual limit on Enter
						}}
						keyboardType="numeric"
						placeholder="1000"
						placeholderTextColor="rgba(255,255,255,0.5)"
						returnKeyType="done"
					/>
				</View>
			</View>

			{/* Data list */}
			<ScrollView
				className="bg-gray-100 pt-2"
				contentContainerStyle={{ paddingBottom: 350 }}
			>
				{chunkedData.length > 0 ? (
					chunkedData.map((pair, index) => (
						<TwoDListsRow
							limit={limit}
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
		</View>
	);
};

export default TwoDLists;
