// TwoDLists.tsx
import HolidayInfo from "@/components/holiday-info";
import TwoDListsRow from "@/components/two-d-lists-row";
import { useCommissionUserContext } from "@/hooks/commission-users/use-commission-user-context";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import { useTwoDlistsPageHeaderContext } from "@/hooks/two-d-list/use-header-context";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { useDebounce } from "@/hooks/use-debounce";
import React, { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

type FilterModeType = "all" | "greater" | "less";

const TwoDLists = () => {
	const date = new Date();
	const { section } = useTwoDlistsPageHeaderContext();
	const { twoDList, fetchTwoDList, loading, error, setError } =
		useTwoDListsContext();
	const { commissionUsers } = useCommissionUserContext();
	const { sections, fetchSection } = useManageContext();
	const [filterMode, setFilterMode] = useState<FilterModeType>("all");
	const [limit, setLimit] = useState<number>(1000);
	const [inputValue, setInputValue] = useState(limit);
	const [selectedUserId, setSelectedUserId] = useState("all");
	const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const isHoliday = false;
	const abortController = new AbortController();
	const debouncedQuery = useDebounce(inputValue, 500);

	useEffect(() => {
		if (debouncedQuery) {
			setLimit(Number(debouncedQuery));
		}
	}, [debouncedQuery]);

	useAbortableEffect(
		(signal) => {
			fetchSection(signal, {
				type: "day",
				date: date,
			});
		},
		[section],
	);

	// 2️⃣ When sections state updates, fetch twoDList
	useAbortableEffect(
		(signal) => {
			if (sections && sections[0] && sections[0][section]) {
				fetchTwoDList(signal, sections[0][section].id);
			}
		},
		[sections, section],
	);

	const users = [
		{ id: "all", name: "All Users" },
		...(commissionUsers || []).map((u) => ({ id: u.id, name: u.name })),
	];

	const data = useMemo(() => {
		const fullList = [];
		for (let i = 0; i < 100; i++) {
			const number = i.toString().padStart(2, "0");
			fullList.push({
				number,
				// items for all users who have this number
				items: twoDList?.filter((x) => x.number === number) || [],
			});
		}
		return fullList;
	}, [twoDList]);

	// Filtered data
	const filteredData = useMemo(() => {
		return data
			.map((item) => {
				if (selectedUserId === "all") {
					const total = item.items.reduce(
						(acc, cur) => acc + Number(cur.total_amount || 0),
						0,
					);
					return { ...item, value: total };
				} else {
					const userItem = item.items.find(
						(x) => x.commission_user === selectedUserId,
					);
					return { ...item, value: Number(userItem?.total_amount || 0) };
				}
			})
			.filter((item) => {
				if (filterMode === "all") return true;
				if (filterMode === "greater") return item.value > limit;
				if (filterMode === "less") return item.value <= limit;
				return true;
			});
	}, [data, selectedUserId, filterMode, limit]);

	// Chunk filtered data into pairs
	const chunkedData = useMemo(() => {
		const chunks: {
			left: (typeof filteredData)[0];
			right?: (typeof filteredData)[0];
		}[] = [];
		for (let i = 0; i < filteredData.length; i += 2) {
			chunks.push({ left: filteredData[i], right: filteredData[i + 1] });
		}
		return chunks;
	}, [filteredData]);

	/* ---------------- UI STATES ---------------- */

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4">
				<Text className="text-red-600 font-semibold text-center mb-4">
					{error}
				</Text>
				<Pressable
					onPress={() => {
						setError(null);
						fetchSection(abortController.signal, {
							type: "day",
							date: date,
						}); // retry
					}}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}

	// Handle loading
	if (loading || !sections) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 p-4">
				<ActivityIndicator
					size={50}
					color="#2563eb"
				/>
			</View>
		);
	}

	// Handle no sections
	if (sections.length === 0) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 p-4">
				<Text className="text-gray-500 font-semibold text-center mb-4">
					No sections found for this date/week.
				</Text>
				<Pressable
					onPress={() =>
						fetchSection(abortController.signal, {
							type: "day",
							date: date,
						})
					}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<View className="flex-col flex-1 bg-gray-100">
			{isHoliday && <HolidayInfo />}

			{/* Toolbar */}
			<View className="flex-row justify-between items-center px-4 pt-3 pb-4 gap-2">
				<View className="flex-row gap-2 flex-1">
					{/* Filter button */}
					<View className="flex-1 relative">
						<TouchableOpacity
							className="flex-1 py-3 bg-indigo-800/70 rounded-full items-center"
							onPress={() => setFilterDropdownOpen(!filterDropdownOpen)}
						>
							<Text
								className="text-white font-semibold text-sm capitalize"
								numberOfLines={1} // single line
							>
								{filterMode === "greater"
									? "Greater"
									: filterMode === "less"
										? "Less"
										: "All"}{" "}
								▼
							</Text>
						</TouchableOpacity>

						{/* Filter dropdown */}
						{filterDropdownOpen && (
							<View
								className="absolute top-12 left-0 p-2 z-50"
								style={{
									backgroundColor: "#a5b4fc", // strong indigo
									minWidth: 140,
									borderRadius: 12,
									shadowColor: "#000",
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.25,
									shadowRadius: 4,
									elevation: 5,
								}}
							>
								{["all", "greater", "less"].map((mode) => (
									<TouchableOpacity
										key={mode}
										className="py-2 px-3 rounded-md mb-1"
										style={{ backgroundColor: "rgb(55 48 163 / 0.6)" }} // lighter indigo
										onPress={() => {
											setFilterMode(mode as FilterModeType);
											setFilterDropdownOpen(false);
										}}
									>
										<Text
											className="text-white font-semibold capitalize"
											numberOfLines={1}
										>
											{mode === "greater"
												? "Greater"
												: mode === "less"
													? "Less"
													: "All"}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>

					{/* Limit input */}
					<View className="w-[130px] bg-indigo-800/70 rounded-full items-center flex-row justify-center gap-1 pl-3">
						<Text className="text-white font-semibold text-sm">Limit:</Text>
						<TextInput
							className="flex-1 text-center text-white bg-indigo-900/70 rounded-full font-semibold text-sm"
							value={inputValue.toLocaleString()}
							onChangeText={(text) => {
								const clean = text.replace(/,/g, "");
								setInputValue(Number(clean) || 0);
							}}
							keyboardType="numeric"
							placeholder="1000"
							placeholderTextColor="rgba(255,255,255,0.5)"
							returnKeyType="done"
							numberOfLines={1}
						/>
					</View>
				</View>

				{/* User button */}
				<View className="relative min-w-[140px]">
					<TouchableOpacity
						className="p-3 bg-indigo-800/70 rounded-full items-center"
						onPress={() => setUserDropdownOpen(!userDropdownOpen)}
					>
						<Text
							className="text-white font-semibold text-sm"
							numberOfLines={1}
						>
							{users.find((u) => u.id === selectedUserId)?.name || "All Users"}▼
						</Text>
					</TouchableOpacity>

					{/* User dropdown */}
					{userDropdownOpen && (
						<View
							className="absolute top-12 right-0 p-2 z-50"
							style={{
								backgroundColor: "#a5b4fc", // strong indigo
								minWidth: 160,
								borderRadius: 12,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 5,
							}}
						>
							{users.map((user) => (
								<TouchableOpacity
									key={user.id}
									className="py-2 px-3 rounded-md mb-1"
									style={{ backgroundColor: "rgb(55 48 163 / 0.6)" }} // lighter indigo
									onPress={() => {
										setSelectedUserId(user.id);
										setUserDropdownOpen(false);
									}}
								>
									<Text
										className="text-white font-semibold"
										numberOfLines={1}
									>
										{user.name}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					)}
				</View>
			</View>

			{/* Data list */}
			<ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
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
