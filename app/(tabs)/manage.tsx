// Manage.tsx
import ManagePageHeaderRight from "@/components/header-rights/manage-page";
import ManageDatePickerHeader from "@/components/manage/manage-date-picker-header";
import ManageDaySummary from "@/components/manage/manage-day-summary";
import ManageWeekSummary from "@/components/manage/manage-week-summary";
import PageWrapper from "@/components/page-wrapper";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { useDebounce } from "@/hooks/use-debounce";
import { getWeekOfMonth } from "@/lib/helpers";
import { RangeMode, SectionRange } from "@/types/manage-types";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";

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
		const abortController = new AbortController();

		fetchSection(abortController.signal, selectedSectionRange);
	}, [selectedSectionRange]);

	const refreshData = async () => {
		setRefreshing(true);
		setError(null);
		const abortController = new AbortController();

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
			<PageWrapper
				loading={loading}
				error={error}
				onReload={refreshData}
				empty={!sections || sections.length === 0}
				emptyMessage="No sections found for this date/week."
			>
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
			</PageWrapper>
		</>
	);
};

export default Manage;
