// Manage.tsx
import DatePickerHeader from "@/components/date-picker-header";
import ManagePageHeaderRight from "@/components/header-rights/manage-page";
import ManageDaySummary from "@/components/manage/manage-day-summary";
import ManageWeekSummary from "@/components/manage/manage-week-summary";
import SummaryCard from "@/components/manage/summary-card";
import PageWrapper from "@/components/page-wrapper";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import { calculateWeekSectionSummary } from "@/lib/calculate-week-summary";
import { getWeekRangeFromDate } from "@/lib/datetime-helper";
import { RangeMode, SectionSummaries } from "@/types/manage-types";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";

const Manage = () => {
	const {
		error,
		loading,
		sections,
		setSelectedSectionRange,
		refetch,
		selectedSectionRange,
		createSection,
		creatingSection,
		editSection,
		editingSection,
		deleteSection,
		deletingSection,
	} = useManageContext();

	const [rangeMode, setRangeMode] = useState<RangeMode>("day");

	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		setSelectedSectionRange((prev) => {
			if (!prev) return prev;
			const date = new Date();

			if (rangeMode === "week" && prev.type === "day") {
				const { start, end } = getWeekRangeFromDate(date);
				return {
					type: "week",
					start_date: start,
					end_date: end,
				};
			}
			if (rangeMode === "day" && prev.type === "week") {
				return { type: "day", date: date };
			}
			return prev;
		});
	}, [rangeMode, setSelectedSectionRange]);

	const weekSummary =
		sections && rangeMode === "week"
			? calculateWeekSectionSummary(sections)
			: null;

	const refreshData = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	const renderSectionItem = ({ item }: { item: SectionSummaries }) => {
		// item is sections[0] for day mode or sections for week mode
		if (rangeMode === "day") {
			return (
				<ManageDaySummary
					createSection={createSection}
					creatingSection={creatingSection}
					editSection={editSection}
					editingSection={editingSection}
					deleteSection={deleteSection}
					deletingSection={deletingSection}
					sections={item}
				/>
			);
		} else {
			return (
				<ManageWeekSummary
					section={item}
					setRangeMode={setRangeMode}
					setSelectedSectionRange={setSelectedSectionRange}
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
				loading={loading && !refreshing}
				error={error}
				onReload={refetch}
				empty={!sections || sections.length === 0}
				emptyMessage="No sections found for this date/week."
			>
				<FlatList
					data={sections}
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
						<>
							<DatePickerHeader
								selectedSectionRange={selectedSectionRange}
								setSelectedSectionRange={setSelectedSectionRange}
							/>
							{rangeMode === "week" && weekSummary && (
								<SummaryCard
									summary={weekSummary}
									type="week"
								/>
							)}
						</>
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
