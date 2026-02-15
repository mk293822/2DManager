import ManageDatePickerHeader from "@/components/manage/manage-date-picker-header";
import ManageDaySummary from "@/components/manage/manage-day-summary";
import ManageWeekSummary from "@/components/manage/manage-week-summary";
import { useManagePageDataContext } from "@/hooks/manage/use-data-context";
import { useManagePageToggleContext } from "@/hooks/manage/user-toggle-context";
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
	const { rangeMode } = useManagePageToggleContext();
	const {
		error,
		loading,
		sections,
		selectedDate,

		// setStates
		setSelectedDate,
		setError,

		// Functions
		fetchSection,
	} = useManagePageDataContext();

	registerTranslation("en-GB", enGB);

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
				<ManageDatePickerHeader
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
					rangeMode={rangeMode}
				/>

				{rangeMode === "day" ? (
					<ManageDaySummary
						selectedDate={selectedDate}
						sections={sections[0]}
					/>
				) : (
					<ManageWeekSummary sections={sections} />
				)}
			</ScrollView>
		</PaperProvider>
	);
};

export default Manage;
