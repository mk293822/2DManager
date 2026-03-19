// Manage.tsx
import ManagePageHeaderRight from "@/components/header-rights/manage-page";
import { Loading } from "@/components/loading";
import ManageDatePickerHeader from "@/components/manage/manage-date-picker-header";
import ManageDaySummary from "@/components/manage/manage-day-summary";
import ManageWeekSummary from "@/components/manage/manage-week-summary";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { useDebounce } from "@/hooks/use-debounce";
import { getWeekOfMonth } from "@/lib/helpers";
import { RangeMode, SectionRange } from "@/types/manage-types";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

const Manage = () => {
	const {
		error,
		loading,
		sections,
		setError,
		fetchSection,
		handleCreateSection,
		onEditSave,
		onConfirmDelete,
	} = useManageContext();

	const [rangeMode, setRangeMode] = useState<RangeMode>("day");
	const debounceRangeMode = useDebounce(rangeMode, 400);

	const date = new Date();
	const [selectedSectionRange, setSelectedSectionRange] =
		useState<SectionRange>({
			type: "day",
			date: date,
		});

	const [refreshing, setRefreshing] = useState(false);
	const abortController = new AbortController();

	useEffect(() => {
		setSelectedSectionRange((prev) => {
			if (!prev) return prev;
			if (debounceRangeMode === "week" && prev.type === "day") {
				return {
					type: "week",
					year: date.getFullYear(),
					month: date.getMonth(),
					week: getWeekOfMonth(date),
				};
			}
			if (debounceRangeMode === "day" && prev.type === "week") {
				return { type: "day", date: date };
			}
			return prev;
		});
	}, [debounceRangeMode]);

	useAbortableEffect(() => {
		fetchSection(abortController.signal, selectedSectionRange);
	}, [selectedSectionRange]);

	const refreshData = async () => {
		setRefreshing(true);
		setError(null);
		await fetchSection(abortController.signal, selectedSectionRange, false);
		setRefreshing(false);
	};

	const renderSectionItem = ({ item }: { item: any }) => {
		// item is sections[0] for day mode or sections for week mode
		if (debounceRangeMode === "day") {
			return (
				<ManageDaySummary
					onConfirmDelete={onConfirmDelete}
					onEditSave={onEditSave}
					handleCreateSection={handleCreateSection}
					sections={item}
				/>
			);
		} else {
			return (
				<ManageWeekSummary
					sections={item}
					setRangeMode={setRangeMode}
					setSelectedSectionRange={setSelectedSectionRange}
					handleCreateSection={handleCreateSection}
				/>
			);
		}
	};

	/* ---------------- MAIN RENDER ---------------- */

	return (
		<>
			<Tabs.Screen
				options={{
					headerRight: () => (
						<ManagePageHeaderRight
							rangeMode={rangeMode}
							setRangeMode={setRangeMode}
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
						onPress={refreshData}
						className="bg-indigo-600 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				</View>
			) : loading ? (
				<Loading />
			) : !sections || sections.length === 0 ? (
				<View className="flex-1 items-center justify-center bg-gray-100 p-4">
					<Text className="text-gray-500 font-semibold text-center mb-4">
						No sections found for this date/week.
					</Text>
					<Pressable
						onPress={refreshData}
						className="bg-indigo-600 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				</View>
			) : (
				<FlatList
					data={debounceRangeMode === "day" ? sections : [sections]}
					keyExtractor={(_, index) => index.toString()}
					renderItem={renderSectionItem}
					refreshControl={
						<RefreshControl
							colors={["#0000ff"]}
							refreshing={refreshing}
							onRefresh={refreshData}
						/>
					}
					ListHeaderComponent={
						<ManageDatePickerHeader
							selectedSectionRange={selectedSectionRange}
							setSelectedSectionRange={setSelectedSectionRange}
						/>
					}
					contentContainerStyle={{
						paddingBottom: 100,
						padding: 15,
					}}
				/>
			)}
		</>
	);
};

export default Manage;
