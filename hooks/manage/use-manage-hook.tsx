import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import { calculateSectionSummary } from "@/lib/calculate-summary";
import { eventBus } from "@/lib/event-bus";
import {
	formatDateRequest,
	ParsedErrors,
	parseErrors,
	upsertByDate,
} from "@/lib/helpers";
import {
	Section,
	SectionName,
	SectionRange,
	SectionSummaries,
} from "@/types/manage-types";
import { useCallback, useState } from "react";
import { useAbortableEffect } from "../use-abortable-effect";

export type ManageHookType = {
	sections: SectionSummaries[] | null;
	loading: boolean;
	error: string | null;

	setError: React.Dispatch<React.SetStateAction<string | null>>;

	handleCreateSection: (section: SectionName, date?: Date) => Promise<void>;
	onEditSave: (
		form: Partial<Section>,
		id: string,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<SectionSummaryEditFields>;
	}>;
	onConfirmDelete: (id: string, date: string) => Promise<void>;
	fetchSection: (
		signal: AbortSignal,
		sectionRange: SectionRange,
		showLoading?: boolean,
	) => Promise<void>;
	reset: () => Promise<void>;
};

export type SectionSummaryEditFields =
	| "draw_number"
	| "draw_times"
	| "total_amount"
	| "total_draw_value"
	| "total_commission"
	| "total_resold"
	| "total_resold_commission"
	| "total_resold_draw_value"
	| "total_resold_draw_amount";

const useManageHook = (): ManageHookType => {
	const [sections, setSections] = useState<SectionSummaries[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSection = useCallback(
		async (
			signal: AbortSignal,
			sectionRange: SectionRange,
			showLoading: boolean = true,
		) => {
			try {
				if (showLoading) setLoading(true);
				setError(null);

				const { data } = await api.get(`/manager/sections/`, {
					signal,
					params:
						sectionRange.type === "day"
							? { type: "day", date: formatDateRequest(sectionRange.date) }
							: { ...sectionRange, month: sectionRange.month + 1 },
				});

				if (!signal.aborted) {
					const sectionsArray: SectionSummaries[] =
						sectionRange.type === "day" ? [data] : data;
					setSections(sectionsArray);
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
		[],
	);

	const reset = async () => {
		const controller = new AbortController();

		setError(null);
		await fetchSection(controller.signal, {
			type: "day",
			date: new Date(),
		});
	};

	useAbortableEffect((signal) => {
		fetchSection(signal, {
			type: "day",
			date: new Date(),
		});
	}, []);

	const handleCreateSection = async (
		section: SectionName = "morning_section",
		date: Date = new Date(),
	) => {
		try {
			const { data } = await api.post<SectionSummaries>("/manager/sections/", {
				section: section,
				date: formatDateRequest(date),
			});
			setSections((prev) => upsertByDate<SectionSummaries>(prev, data));
		} catch {
			setError("Failed to create section");
		}
	};

	const onEditSave = async (form: Partial<Section>, id: string) => {
		try {
			const { data } = await api.put<SectionSummaries>(
				`/manager/sections/${id}/`,
				{
					...form,
				},
			);
			setSections((prev) => upsertByDate(prev, data));
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				title: "Success",
				description: "Edit successfully!",
			});

			return { success: true, errors: { fields: {} } };
		} catch (err: any) {
			const data = err?.response?.data || {};

			const errors = parseErrors<SectionSummaryEditFields>(data, [
				"draw_number",
				"draw_times",
				"total_amount",
				"total_commission",
				"total_draw_value",
				"total_resold",
			]);

			return { success: false, errors };
		}
	};

	const onConfirmDelete = async (id: string, date: string) => {
		setLoading(true);
		try {
			await api.delete(`/manager/sections/${id}/`);
			setSections((prev) => {
				if (!prev) return null;

				return prev.map((day) => {
					if (day.date !== date) return day;
					const morning =
						day.morning_section?.id === id ? null : day.morning_section;

					const evening =
						day.evening_section?.id === id ? null : day.evening_section;

					const summary = calculateSectionSummary(morning, evening);

					return {
						...day,
						summary,
						morning_section: morning,
						evening_section: evening,
					};
				});
			});
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") return;
			setError("Failed to delete section");
		} finally {
			setLoading(false);
		}
	};

	return {
		sections,
		loading,
		error,

		// SetStates
		setError,

		// functions
		handleCreateSection,
		onEditSave,
		fetchSection,
		onConfirmDelete,
		reset,
	};
};

export default useManageHook;
