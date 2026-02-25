import { formatDateDisplay } from "@/lib/helpers";
import { SectionRange, WeekRange } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import WeekPickerModal from "../week-picker-modal";

type Props = {
	selectedSectionRange: SectionRange;
	setSelectedSectionRange: React.Dispatch<React.SetStateAction<SectionRange>>;
};

const ManageDatePickerHeader = ({
	selectedSectionRange,
	setSelectedSectionRange,
}: Props) => {
	const [showPicker, setShowPicker] = useState(false);

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
								: `${selectedSectionRange.year} • ${new Date(
										selectedSectionRange.year,
										selectedSectionRange.month,
									).toLocaleString("default", {
										month: "long",
									})} • Week ${(selectedSectionRange as WeekRange).week}`}
						</Text>
					</View>
				</View>

				<Text className="text-indigo-600 text-sm font-semibold">Change</Text>
			</Pressable>

			{selectedSectionRange.type === "day" ? (
				<DatePickerModal
					locale="en-GB"
					mode="single"
					visible={showPicker}
					date={selectedSectionRange.date}
					onDismiss={() => setShowPicker(false)}
					onConfirm={({ date }) => {
						setShowPicker(false);
						if (date)
							setSelectedSectionRange({
								type: "day",
								date: date,
							});
					}}
				/>
			) : (
				<WeekPickerModal
					visible={showPicker}
					initialData={selectedSectionRange}
					onDismiss={() => setShowPicker(false)}
					onConfirm={(date) => {
						setSelectedSectionRange({
							type: "week",
							year: date.year,
							month: date.month,
							week: date.week,
						});
						setShowPicker(false);
					}}
				/>
			)}
		</>
	);
};

export default ManageDatePickerHeader;
