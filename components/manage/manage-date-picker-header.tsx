import { formatDateDisplay } from "@/lib/helpers";
import { RangeMode } from "@/types/event-bus";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

type Props = {
	selectedDate: Date;
	setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
	rangeMode: RangeMode;
};

const ManageDatePickerHeader = ({
	selectedDate,
	setSelectedDate,
	rangeMode,
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
		</>
	);
};

export default ManageDatePickerHeader;
