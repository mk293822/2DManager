import ManageDatePickerHeader from "@/components/manage/manage-date-picker-header";
import ManageDaySummary from "@/components/manage/manage-day-summary";
import ManageWeekSummary from "@/components/manage/manage-week-summary";
import useManageHook from "@/hooks/manage/use-manage-hook";
import { useManagePageHeaderContext } from "@/hooks/manage/user-header-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { getWeekOfMonth } from "@/lib/helpers";
import { SectionRange } from "@/types/manage-types";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
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
	} = useManageHook();
	const { rangeMode } = useManagePageHeaderContext();

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
			if (rangeMode === "week" && prev.type === "day") {
				return {
					type: "week",
					year: date.getFullYear(),
					month: date.getMonth(),
					week: getWeekOfMonth(date),
				};
			}
			if (rangeMode === "day" && prev.type === "week") {
				return {
					type: "day",
					date: date,
				};
			}

			return prev;
		});
	}, [rangeMode]);

	useAbortableEffect(() => {
		fetchSection(abortController.signal, selectedSectionRange);
	}, [selectedSectionRange]);

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
						fetchSection(abortController.signal, selectedSectionRange); // retry
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
						fetchSection(abortController.signal, selectedSectionRange)
					}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}
	/* ---------------- MAIN RENDER ---------------- */

	return (
		<PaperProvider>
			<ScrollView
				className="flex-1 bg-gray-100 p-4"
				contentContainerStyle={{ paddingBottom: 120 }}
			>
				<ManageDatePickerHeader
					selectedSectionRange={selectedSectionRange}
					setSelectedSectionRange={setSelectedSectionRange}
				/>

				{rangeMode === "day" ? (
					<ManageDaySummary
						onConfirmDelete={onConfirmDelete}
						onEditSave={onEditSave}
						handleCreateSection={handleCreateSection}
						sections={sections[0]}
					/>
				) : (
					<ManageWeekSummary
						sections={sections}
						setSelectedSectionRange={setSelectedSectionRange}
						handleCreateSection={handleCreateSection}
					/>
				)}
			</ScrollView>
		</PaperProvider>
	);
};

export default Manage;
