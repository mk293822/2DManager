// TwoDLists.tsx
import TwoDListsPageHeaderRight from "@/components/header-rights/two-d-lists";
import PageWrapper from "@/components/page-wrapper";
import TwoDListToolBar from "@/components/two-d-lists/toolbar";
import TwoDListsRow from "@/components/two-d-lists/two-d-lists-row";
import useBussinessUserHook from "@/hooks/bussiness-users/use-bussiness-user-hook";
import useTwoDListHook from "@/hooks/two-d-list/use-two-d-list-hook";
import { useCalculatedNumbersData } from "@/hooks/use-calculated-numbers-data";
import { useDebounce } from "@/hooks/use-debounce";
import { changeSectionName } from "@/lib/helpers";
import { chunkIntoPairs } from "@/lib/two-d-list-helper";
import { SectionName } from "@/types/manage-types";
import {
	FilterModeType,
	NumberItem,
	NumberType,
} from "@/types/two-d-list-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const TwoDLists = () => {
	const [numberType, setNumberType] = useState<NumberType>("sold_number");
	const { section, id, draw_number } = useLocalSearchParams<{
		section: SectionName;
		id: string;
		draw_number: string;
	}>();
	const { twoDListGroup, loading, error, refetch } = useTwoDListHook(
		numberType,
		id,
	);
	const { bussinessUsers } = useBussinessUserHook(
		numberType === "sold_number" ? "commission_user" : "resold_user",
	);
	const [filterMode, setFilterMode] = useState<FilterModeType>("all");
	const [limit, setLimit] = useState<number>(1000);
	const [inputValue, setInputValue] = useState(limit);
	const [selectedUserId, setSelectedUserId] = useState("all");
	const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const [refreshing, setRefreshing] = useState(false); // ⬅️ for pull-to-refresh
	const debouncedQuery = useDebounce(inputValue, 500);

	useEffect(() => {
		if (debouncedQuery) {
			setLimit(Number(debouncedQuery));
		}
	}, [debouncedQuery]);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	const users = [
		{ id: "all", name: "All Users" },
		...(bussinessUsers || []).map((u) => ({ id: u.id, name: u.name })),
	];

	const numbers: NumberItem[] = twoDListGroup
		? Object.entries(twoDListGroup.sold_numbers_by_user ?? {})
				.filter(([user]) => selectedUserId === "all" || user === selectedUserId)
				.flatMap(([, twoDListArray]) => twoDListArray)
				.flatMap((item) => item.numbers_data)
		: [];

	const calculatedData = useCalculatedNumbersData(numbers, filterMode, limit);
	const chunkedData = chunkIntoPairs(calculatedData);

	const renderItem = ({ item }: { item: (typeof chunkedData)[0] }) => (
		<TwoDListsRow
			draw_number={draw_number || null}
			limit={limit}
			left={item.left}
			right={item.right}
		/>
	);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: `${changeSectionName(section)}`,
					headerLeft: ({ canGoBack, tintColor }) =>
						canGoBack ? (
							<TouchableOpacity
								onPress={() => router.back()}
								style={{
									marginRight: 15,
								}}
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
							>
								<AntDesign
									name="arrow-left"
									size={20}
									color={tintColor}
								/>
							</TouchableOpacity>
						) : null,
					headerRight: () => (
						<TwoDListsPageHeaderRight
							numberType={numberType}
							setNumberType={setNumberType}
						/>
					),
				}}
			/>

			<PageWrapper
				loading={loading && !refreshing}
				error={error}
				onReload={refetch}
				empty={!twoDListGroup}
				emptyMessage={`No sections found for ${changeSectionName(section)} section.`}
			>
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

				{/* Data list */}
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
						contentContainerStyle={{ paddingBottom: 50 }}
					/>
				) : (
					<View className="flex-col items-center justify-center h-40">
						<Text className="text-3xl font-bold text-gray-400">
							No Item Exists
						</Text>
					</View>
				)}
			</PageWrapper>
		</>
	);
};

export default TwoDLists;
