import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { api } from "@/lib/api";
import { formatDateRequest } from "@/lib/helpers";
import { RangeMode } from "@/types/event-bus";
import { Section, SectionName, SectionSummaries } from "@/types/manage-types";
import { useCallback, useState } from "react";

export type useManageHookType = {
	sections: SectionSummaries[] | null;
	loading: boolean;
	error: string | null;
	rangeMode: RangeMode;
	selectedDate: Date;

	setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	setRangeMode: React.Dispatch<React.SetStateAction<RangeMode>>;

	handleCreateSection: (section: SectionName, date?: Date) => void;
	onSave: (section: Omit<Section, "id" | "manager" | "section">) => void;
	fetchSection: (
		signal: AbortSignal,
		mode?: RangeMode,
		date?: Date,
	) => Promise<void>;
};

const useManageHook = (): useManageHookType => {
	const [rangeMode, setRangeMode] = useState<RangeMode>("day");
	const [sections, setSections] = useState<SectionSummaries[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedDate, setSelectedDate] = useState(new Date());

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

	const onSave = async (
		section: Omit<Section, "id" | "manager" | "section">,
	) => {};

	return {
		sections,
		loading,
		error,
		rangeMode,
		selectedDate,

		// SetStates
		setSelectedDate,
		setError,
		setRangeMode,

		// functions
		handleCreateSection,
		onSave,
		fetchSection,
	};
};

export default useManageHook;
