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
import { Pressable, ScrollView, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { enGB, registerTranslation } from "react-native-paper-dates";

const Manage = () => {
	const {
		error,
		loading,
		sections,

		setError,

		// Functions
		fetchSection,
		handleCreateSection,
		onEditSave,
		onConfirmDelete,
	} = useManageContext();

	const [rangeMode, setRangeMode] = useState<RangeMode>("day");
	const debounceRangeMode = useDebounce(rangeMode, 500);
	registerTranslation("en-GB", enGB);
	const date = new Date();

	const [selectedSectionRange, setSelectedSectionRange] =
		useState<SectionRange>({
			type: "day",
			date: date,
		});

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
				return {
					type: "day",
					date: date,
				};
			}

			return prev;
		});
	}, [debounceRangeMode]);

	useAbortableEffect(() => {
		fetchSection(abortController.signal, selectedSectionRange);
	}, [selectedSectionRange]);

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
						onPress={() => {
							setError(null);
							fetchSection(abortController.signal, selectedSectionRange); // retry
						}}
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
						onPress={() =>
							fetchSection(abortController.signal, selectedSectionRange)
						}
						className="bg-indigo-600 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">Reload</Text>
					</Pressable>
				</View>
			) : (
				<PaperProvider>
					<ScrollView
						className="flex-1 bg-gray-100 p-4"
						contentContainerStyle={{ paddingBottom: 120 }}
					>
						<ManageDatePickerHeader
							selectedSectionRange={selectedSectionRange}
							setSelectedSectionRange={setSelectedSectionRange}
						/>

						{debounceRangeMode === "day" ? (
							<ManageDaySummary
								onConfirmDelete={onConfirmDelete}
								onEditSave={onEditSave}
								handleCreateSection={handleCreateSection}
								sections={sections[0]}
							/>
						) : (
							<ManageWeekSummary
								setRangeMode={setRangeMode}
								sections={sections}
								setSelectedSectionRange={setSelectedSectionRange}
								handleCreateSection={handleCreateSection}
							/>
						)}
					</ScrollView>
				</PaperProvider>
			)}
		</>
	);
};

export default Manage;
