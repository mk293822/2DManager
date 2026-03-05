// TwoDLists.tsx
import HolidayInfo from "@/components/holiday-info";
import { Loading } from "@/components/loading";
import TwoDListToolBar from "@/components/two-d-lists/toolbar";
import TwoDListsRow from "@/components/two-d-lists/two-d-lists-row";
import { useCommissionUserContext } from "@/hooks/commission-users/use-commission-user-context";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import { useCalculatedData } from "@/hooks/two-d-list/use-calculated-data";
import { useTwoDlistsPageHeaderContext } from "@/hooks/two-d-list/use-header-context";
import { useTwoDListsContext } from "@/hooks/two-d-list/use-two-d-list-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { useDebounce } from "@/hooks/use-debounce";
import { FilterModeType } from "@/types/two-d-list-types";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const TwoDLists = () => {
	const date = new Date();
	const { twoDListGroup, loading, error, setError, fetchTwoDList } =
		useTwoDListsContext();
	const { commissionUsers } = useCommissionUserContext();
	const [filterMode, setFilterMode] = useState<FilterModeType>("all");
	const [limit, setLimit] = useState<number>(1000);
	const [inputValue, setInputValue] = useState(limit);
	const [selectedUserId, setSelectedUserId] = useState("all");
	const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const isHoliday = false;
	const debouncedQuery = useDebounce(inputValue, 500);
	const { section } = useTwoDlistsPageHeaderContext();
	const debouncedSection = useDebounce(section, 500);
	const {
		sections,
		fetchSection,
		loading: sectionLoading,
	} = useManageContext();
	const abortController = new AbortController();

	// 2️⃣ When sections state updates, fetch twoDList
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

	const reset = async () => {
		setError(null);
		fetchSection(abortController.signal, {
			type: "day",
			date: date,
		});
	};

	const users = [
		{ id: "all", name: "All Users" },
		...(commissionUsers || []).map((u) => ({ id: u.id, name: u.name })),
	];

	// Chunk filtered data into pairs
	const chunkedData = useCalculatedData(
		selectedUserId,
		filterMode,
		limit,
		twoDListGroup,
	);

	/* ---------------- UI STATES ---------------- */

	if (error) {
		return (
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
		);
	}

	// Handle loading
	if ((loading || sectionLoading) && !twoDListGroup) {
		return <Loading />;
	}

	// Handle no sections
	if (!twoDListGroup) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 p-4">
				<Text className="text-gray-500 font-semibold text-center mb-4">
					No sections found for today.
				</Text>
				<Pressable
					onPress={reset}
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
