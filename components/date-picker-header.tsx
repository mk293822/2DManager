import { formatDateDisplay, formatWeekDisplay } from "@/lib/datetime-helper";
import { SectionRange } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import DateWeekPickerModal from "./date-week-picker-modal";

type Props = {
	selectedSectionRange: SectionRange;
	setSelectedSectionRange: React.Dispatch<React.SetStateAction<SectionRange>>;
};

const DatePickerHeader = ({
	selectedSectionRange,
	setSelectedSectionRange,
}: Props) => {
	const [showPicker, setShowPicker] = useState(false);

	// Helper to format week range for display

	return (
		<>
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
							{selectedSectionRange.type === "day"
								? "Select date"
								: "Select Week"}
						</Text>
						<Text className="text-indigo-700 font-semibold">
							{selectedSectionRange.type === "day"
								? formatDateDisplay(selectedSectionRange.date)
								: formatWeekDisplay(selectedSectionRange)}
						</Text>
					</View>
				</View>

				<Text className="text-indigo-600 text-sm font-semibold">Change</Text>
			</Pressable>

			<DateWeekPickerModal
				visible={showPicker}
				mode={selectedSectionRange.type === "day" ? "date" : "week"}
				initialDate={
					selectedSectionRange.type === "day"
						? {
								type: "date",
								year: selectedSectionRange.date.getFullYear(),
								month: selectedSectionRange.date.getMonth(),
								day: selectedSectionRange.date.getDate(),
							}
						: undefined
				}
				initialWeek={
					selectedSectionRange.type === "week"
						? {
								type: "week",
								start_date: selectedSectionRange.start_date,
								end_date: selectedSectionRange.end_date,
							}
						: undefined
				}
				onDismiss={() => setShowPicker(false)}
				onConfirm={(data) => {
					setShowPicker(false);

					if (data.type === "date") {
						setSelectedSectionRange({
							type: "day",
							date: new Date(data.year, data.month, data.day),
						});
					} else {
						setSelectedSectionRange({
							type: "week",
							start_date: data.start_date,
							end_date: data.end_date,
						});
					}
				}}
			/>
		</>
	);
};

export default DatePickerHeader;
