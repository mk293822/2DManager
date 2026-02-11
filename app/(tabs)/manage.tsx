import ManageDaySummary from "@/components/manage-day-summary";
import ManageWeekSummary from "@/components/manage-week-summary";
import { EVENT_NAMES } from "@/event-names";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { api } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import { RangeMode } from "@/types/event-bus";
import { SectionSummaries } from "@/types/manage-types";
import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

const Manage = () => {
	const [rangeMode, setRangeMode] = useState<RangeMode>("today");
	const [sections, setSections] = useState<SectionSummaries>();

	useEffect(() => {
		const off = eventBus.on(EVENT_NAMES.CHANGE_DATE_RANGE, (mode) => {
			setRangeMode(mode);
		});
		return () => off();
	}, []);

	const fetchSection = useCallback(async (signal: AbortSignal) => {
		const { data } = await api.get<SectionSummaries>("/manager/sections", {
			signal,
		});
		setSections(data);
	}, []);

	useAbortableEffect((signal) => {
		fetchSection(signal);
	}, []);

	return (
		<PaperProvider>
			<ScrollView
				className="flex-1 bg-gray-100 p-4"
				contentContainerStyle={{
					paddingBottom: 100,
				}}
			>
				{rangeMode === "today" ? (
					<ManageDaySummary sections={sections} />
				) : (
					<ManageWeekSummary />
				)}
			</ScrollView>
		</PaperProvider>
	);
};

export default Manage;
