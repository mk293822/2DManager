import ManageDaySummary from "@/components/manage-day-summary";
import ManageWeekSummary from "@/components/manage-week-summary";
import { EVENT_NAMES } from "@/event-names";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { api } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import { formatDateDisplay, formatDateRequest } from "@/lib/helpers";
import { RangeMode } from "@/types/event-bus";
import { SectionName, SectionSummaries } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import {
	DatePickerModal,
	enGB,
	registerTranslation,
} from "react-native-paper-dates";

const Manage = () => {
	const [rangeMode, setRangeMode] = useState<RangeMode>("day");
	const [sections, setSections] = useState<SectionSummaries[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPicker, setShowPicker] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());

	registerTranslation("en-GB", enGB);

	const fetchSection = useCallback(
		async (
			signal: AbortSignal,
			mode: RangeMode = rangeMode,
			date: Date = selectedDate,
		) => {
			try {
				setLoading(true);
				setError(null);

				const { data } = await api.get<SectionSummaries[]>(
					`/manager/sections?date=${formatDateRequest(date)}&type=${mode}`,
					{ signal },
				);

				if (!signal.aborted) {
					setSections(data);
				}
			} catch (err: any) {
				if (err.name === "CanceledError" || err.name === "AbortError") {
					// Request was cancelled → do nothing
					return;
				}

				setError("Failed to load sections. Please try again.");
				setSections([]);
			} finally {
				if (!signal.aborted) {
					setLoading(false);
				}
			}
		},
		[selectedDate, rangeMode],
	);

	// Range change (event bus — still works, but props would be better)
	useEffect(() => {
		const handler = async ({
			range,
			date = new Date(),
		}: {
			date?: Date;
			range: RangeMode;
		}) => {
			const controller = new AbortController();

			setRangeMode(range);
			setSelectedDate(date);
			setSections(null);

			await fetchSection(controller.signal, range, date);

			return () => controller.abort();
		};

		eventBus.on(EVENT_NAMES.CHANGE_DATE_RANGE, handler);
		return () => eventBus.off(EVENT_NAMES.CHANGE_DATE_RANGE, handler);
	}, [fetchSection]);

	// Date change
	useAbortableEffect(
		(signal) => {
			fetchSection(signal);
		},
		[selectedDate],
	);

	const handleCreateSection = async (
		section: SectionName = "morning_section",
		date: Date = selectedDate,
	) => {
		setLoading(true);
		try {
			const { data } = await api.post<SectionSummaries>("/manager/sections/", {
				section: section,
				date: formatDateRequest(date),
			});
			setSections((prev) => {
				if (!prev) return [data];

				const idx = prev.findIndex((d) => d.summary.date === data.summary.date);

				if (idx !== -1) {
					// Replace existing day
					const newSections = [...prev];
					newSections[idx] = data;
					return [...newSections].sort(
						(a, b) =>
							new Date(a.summary.date).getTime() -
							new Date(b.summary.date).getTime(),
					);
				}

				// Add new day if not found
				return [...prev, data];
			});
		} catch {
			setError("Failed to create section");
		} finally {
			setLoading(false);
		}
	};

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
						fetchSection(new AbortController().signal); // retry
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
					onPress={() => fetchSection(new AbortController().signal)}
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
				<Pressable
					onPress={() => setShowPicker(true)}
					className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 flex-row items-center justify-between"
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
						visible
						date={selectedDate}
						onDismiss={() => setShowPicker(false)}
						onConfirm={({ date }) => {
							setShowPicker(false);
							if (date) setSelectedDate(date);
						}}
					/>
				)}

				{rangeMode === "day" ? (
					<ManageDaySummary
						selectedDate={selectedDate}
						sections={sections[0]}
						handleCreateSection={handleCreateSection}
					/>
				) : (
					<ManageWeekSummary
						handleCreateSection={handleCreateSection}
						sections={sections}
					/>
				)}
			</ScrollView>
		</PaperProvider>
	);
};

export default Manage;
