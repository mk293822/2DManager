import ManageDaySummary from "@/components/manage-day-summary";
import ManageWeekSummary from "@/components/manage-week-summary";
import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import { RangeMode } from "@/types/event-bus";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

const Manage = () => {
	const [rangeMode, setRangeMode] = useState<RangeMode>("today");

	useEffect(() => {
		const off = eventBus.on(EVENT_NAMES.CHANGE_DATE_RANGE, (mode) => {
			setRangeMode(mode);
		});
		return () => off();
	}, []);

	return (
		<PaperProvider>
			<ScrollView
				className="flex-1 bg-gray-100 p-4"
				contentContainerStyle={{
					paddingBottom: 100,
				}}
			>
				{rangeMode === "today" ? <ManageDaySummary /> : <ManageWeekSummary />}
			</ScrollView>
		</PaperProvider>
	);
};

export default Manage;
