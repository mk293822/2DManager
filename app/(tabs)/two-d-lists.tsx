// TwoDLists.tsx
import TwoDListsHeaderRight from "@/components/header-rights/two-d-lists";
import HolidayInfo from "@/components/holiday-info";
import { Loading } from "@/components/loading";
import TwoDListToolBar from "@/components/two-d-lists/toolbar";
import TwoDListsRow from "@/components/two-d-lists/two-d-lists-row";
import { useCommissionUserContext } from "@/hooks/commission-users/use-commission-user-context";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import { useCalculatedData } from "@/hooks/two-d-list/use-calculated-data";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { useDebounce } from "@/hooks/use-debounce";
import { changeSectionName } from "@/lib/helpers";
import { chunkIntoPairs } from "@/lib/two-d-list-helper";
import { SectionName } from "@/types/manage-types";
import { FilterModeType, SoldNumberItem } from "@/types/two-d-list-types";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

const TwoDLists = () => {
	const date = new Date();
	const { twoDListGroup, loading, error, setError, fetchTwoDList } =
		useTwoDListsContext();
	const [section, setSection] = useState<SectionName>("morning_section");
	const { commissionUsers } = useCommissionUserContext();
	const [filterMode, setFilterMode] = useState<FilterModeType>("all");
	const [limit, setLimit] = useState<number>(1000);
	const [inputValue, setInputValue] = useState(limit);
	const [selectedUserId, setSelectedUserId] = useState("all");
	const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const [refreshing, setRefreshing] = useState(false); // ⬅️ for pull-to-refresh
	const isHoliday = false;
	const debouncedQuery = useDebounce(inputValue, 500);
	const debouncedSection = useDebounce(section, 500);
	const {
		sections,
		fetchSection,
		loading: sectionLoading,
		reset,
	} = useManageContext();
	const abortController = new AbortController();

	useAbortableEffect(
		(signal) => {
			if (debouncedSection) {
				fetchTwoDList(signal, sections?.[0][debouncedSection]?.id);
			}
		},
		[sections, debouncedSection],
	);

	useEffect(() => {
		if (debouncedQuery) {
			setLimit(Number(debouncedQuery));
		}
	}, [debouncedQuery]);

	const onRefresh = async () => {
		setError(null);
		setRefreshing(true);
		await fetchSection(
			abortController.signal,
			{
				type: "day",
				date: date,
			},
			false,
		);
		setRefreshing(false);
	};

	const users = [
		{ id: "all", name: "All Users" },
		...(commissionUsers || []).map((u) => ({ id: u.id, name: u.name })),
	];

	const numbers: SoldNumberItem[] = twoDListGroup
		? Object.entries(twoDListGroup.sold_numbers_by_user ?? {})
				.filter(([user]) => selectedUserId === "all" || user === selectedUserId)
				.flatMap(([, twoDListArray]) => twoDListArray)
				.flatMap((item) => item.numbers_data)
		: [];

	const calculatedData = useCalculatedData(numbers, filterMode, limit);
	const chunkedData = chunkIntoPairs(calculatedData);

	const renderItem = ({ item }: { item: (typeof chunkedData)[0] }) => (
		<TwoDListsRow
			draw_number={sections?.[0][section]?.draw_number || null}
			limit={limit}
			left={item.left}
			right={item.right}
		/>
	);

	return (
		<>
			<Tabs.Screen
				options={{
					headerRight: () => (
						<TwoDListsHeaderRight
							section={section}
							setSection={setSection}
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
						onPress={reset}
						className="bg-indigo-600 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				</View>
			) : loading || sectionLoading ? (
				<Loading />
			) : !twoDListGroup ? (
				<View className="flex-1 items-center justify-center bg-gray-100 p-4">
					<Text className="text-gray-500 font-semibold text-center mb-4">
						No sections found for {changeSectionName(section)} section.
					</Text>
					<Pressable
						onPress={reset}
						className="bg-indigo-600 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				</View>
			) : (
				<View className="flex-col flex-1 bg-gray-100">
					{isHoliday && <HolidayInfo />}

					{/* Toolbar */}
					<TwoDListToolBar
						filterMode={filterMode}
						setFilterMode={setFilterMode}
						users={users}
						selectedUserId={selectedUserId}
						setSelectedUserId={setSelectedUserId}
						userDropdownOpen={userDropdownOpen}
						setUserDropdownOpen={setUserDropdownOpen}
						filterDropdownOpen={filterDropdownOpen}
						setFilterDropdownOpen={setFilterDropdownOpen}
						inputValue={inputValue}
						setInputValue={setInputValue}
					/>

					{/* Data list using FlatList with pull-to-refresh */}
					{chunkedData.length > 0 ? (
						<FlatList
							data={chunkedData}
							keyExtractor={(_, index) => index.toString()}
							renderItem={renderItem}
							refreshControl={
								<RefreshControl
									colors={["#0000ff"]}
									refreshing={refreshing}
									onRefresh={onRefresh}
								/>
							}
							contentContainerStyle={{ paddingBottom: 120 }}
						/>
					) : (
						<View className="flex-col items-center justify-center h-40">
							<Text className="text-3xl font-bold text-gray-400">
								No Item Exists
							</Text>
						</View>
					)}
				</View>
			)}
		</>
	);
};

export default TwoDLists;
