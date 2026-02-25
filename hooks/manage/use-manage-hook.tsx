import { api } from "@/lib/api";
import { formatDateRequest } from "@/lib/helpers";
import {
	Section,
	SectionName,
	SectionRange,
	SectionSummaries,
} from "@/types/manage-types";
import { useCallback, useState } from "react";

export type UseManageHookType = {
	sections: SectionSummaries[] | null;
	loading: boolean;
	error: string | null;

	setError: React.Dispatch<React.SetStateAction<string | null>>;

	handleCreateSection: (section: SectionName, date?: Date) => Promise<void>;
	onEditSave: (
		form: Omit<Section, "id" | "manager" | "section" | "date">,
		id: string,
	) => Promise<void>;
	onConfirmDelete: (id: string, date: string) => Promise<void>;
	fetchSection: (
		signal: AbortSignal,
		sectionRange: SectionRange,
	) => Promise<void>;
};

function upsertByDate(
	prev: SectionSummaries[] | null,
	newDay: SectionSummaries,
) {
	if (!prev) return [newDay];
	const idx = prev.findIndex((d) => d.date === newDay.date);
	if (idx !== -1) {
		const newSections = [...prev];
		newSections[idx] = newDay;
		return newSections.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	}
	return [...prev, newDay].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);
}

const useManageHook = (): UseManageHookType => {
	const [sections, setSections] = useState<SectionSummaries[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSection = useCallback(
		async (signal: AbortSignal, sectionRange: SectionRange) => {
			try {
				setLoading(true);
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

	const handleCreateSection = async (
		section: SectionName = "morning_section",
		date: Date = new Date(),
	) => {
		try {
			const { data } = await api.post<SectionSummaries>("/manager/sections/", {
				section: section,
				date: formatDateRequest(date),
			});
			setSections((prev) => upsertByDate(prev, data));
		} catch {
			setError("Failed to create section");
		}
	};

	const onEditSave = async (
		form: Omit<Section, "id" | "manager" | "section" | "date">,
		id: string,
	) => {
		setLoading(true);
		try {
			const { data } = await api.put<SectionSummaries>(
				`/manager/sections/${id}/`,
				{
					...form,
				},
			);
			setSections((prev) => upsertByDate(prev, data));
		} catch {
			setError("Failed to update section");
		} finally {
			setLoading(false);
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

					// Update morning/evening section
					return {
						date: day.date,
						summary: day.summary,
						morning_section:
							day.morning_section?.id === id ? null : day.morning_section,
						evening_section:
							day.evening_section?.id === id ? null : day.evening_section,
					};
				});
			});
		} catch {
			setError("Failed to update section");
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
	};
};

export default useManageHook;
