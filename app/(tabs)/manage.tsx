import ManageDaySummary from "@/components/manage-day-summary";
import ManageWeekSummary from "@/components/manage-week-summary";
import { EVENT_NAMES } from "@/event-names";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { api } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import { formatDateDisplay } from "@/lib/helpers";
import { RangeMode } from "@/types/event-bus";
import { SectionSummaries } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
	ActivityIndicator,
	Provider as PaperProvider,
} from "react-native-paper";
import {
	DatePickerModal,
	enGB,
	registerTranslation,
} from "react-native-paper-dates";

const Manage = () => {
	const [rangeMode, setRangeMode] = useState<RangeMode>("day");
	const [sections, setSections] = useState<SectionSummaries[]>();
	const [showPicker, setShowPicker] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());

	registerTranslation("en-GB", enGB);

	const fetchSection = useCallback(
		async (signal: AbortSignal, mode: RangeMode = rangeMode) => {
			const { data } = await api.get<SectionSummaries[]>(
				`/manager/sections?date=${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
					selectedDate.getDate(),
				).padStart(2, "0")}&type=${mode}`,
				{ signal },
			);
			setSections(data);
		},
		[selectedDate, rangeMode],
	);

	useEffect(() => {
		const handler = async (mode: RangeMode) => {
			const { signal } = new AbortController();

			setSections(undefined);
			// fetch sections with the new mode
			await fetchSection(signal, mode);

			// update rangeMode only after fetching
			setRangeMode(mode);
		};

		eventBus.on(EVENT_NAMES.CHANGE_DATE_RANGE, handler);
		return () => eventBus.off(EVENT_NAMES.CHANGE_DATE_RANGE, handler);
	}, [fetchSection]);

	useAbortableEffect(
		(signal) => {
			fetchSection(signal);
		},
		[selectedDate],
	);

	if (!sections)
		return (
			<View className="flex-1 items-center justify-center bg-gray-100">
				<ActivityIndicator
					size={50}
					color="#2563eb"
				/>
			</View>
		);

	return (
		<PaperProvider>
			<ScrollView
				className="flex-1 bg-gray-100 p-4"
				contentContainerStyle={{
					paddingBottom: 120,
				}}
			>
				<Pressable
					onPress={() => setShowPicker(true)}
					className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 flex-row items-center justify-between active:opacity-70"
				>
					<View className="flex-row items-center gap-3">
						<View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center">
							<AntDesign
								name="calendar"
								size={22}
								color="#4f46e5"
							/>
						</View>

						<View>
							<Text className="text-xs text-gray-500 font-medium">
								{rangeMode === "day" ? "Select date" : "Select Week"}
							</Text>
							<Text className="text-indigo-700 font-semibold">
								{rangeMode === "day"
									? formatDateDisplay(selectedDate)
									: `Week of ${formatDateDisplay(selectedDate)}`}
							</Text>
						</View>
					</View>

					<Text className="text-indigo-600 text-sm font-semibold">Change</Text>
				</Pressable>

				{showPicker && (
					<DatePickerModal
						locale="en-GB"
						mode="single"
						visible={showPicker}
						date={selectedDate}
						onDismiss={() => setShowPicker(false)}
						onConfirm={({ date }) => {
							setShowPicker(false);
							if (date) setSelectedDate(date);
						}}
						saveLabel="Select"
						animationType="fade"
					/>
				)}
				{rangeMode === "day" ? (
					<ManageDaySummary
						selectedDate={selectedDate}
						sections={sections?.[0]}
					/>
				) : (
					<ManageWeekSummary sections={sections} />
				)}
			</ScrollView>
		</PaperProvider>
	);
};

export default Manage;
