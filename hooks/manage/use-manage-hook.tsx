// hooks/useManageHook.ts
import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import {
	createKey,
	getKeyForSectionRange,
	getParamsForSectionRange,
	syncCachesByDate,
} from "@/lib/cache-helper";
import { calculateSectionSummary } from "@/lib/calculate-summary";
import { formatDateRequest, isToday } from "@/lib/datetime-helper";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors, parseErrors, upsertByDate } from "@/lib/helpers";
import { AppEvents } from "@/types/event-bus";
import {
	Section,
	SectionName,
	SectionRange,
	SectionSummaries,
} from "@/types/manage-types";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { getCache, useCache } from "../use-cache";
import { MutationResult, useMutation } from "../use-mutation";

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

export type ManageHookType = {
	sections: SectionSummaries[] | null;
	loading: boolean;
	error: Error | null;

	refetch: () => Promise<void>;
	createSection: (variables: {
		sectionName: SectionName;
		date?: Date;
	}) => Promise<MutationResult<SectionSummaries, string>>;
	editSection: (variables: {
		form: Partial<Section>;
		id: string;
	}) => Promise<
		MutationResult<SectionSummaries, ParsedErrors<SectionSummaryEditFields>>
	>;
	deleteSection: (variables: {
		id: string;
		date: string;
	}) => Promise<MutationResult<void, string>>;
	creatingSection: boolean;
	editingSection: boolean;
	deletingSection: boolean;
};

const MODEL = "sectionSummaries";

const useManageHook = (range: SectionRange): ManageHookType => {
	const params = getParamsForSectionRange(range);
	const cacheKey = createKey(MODEL, getKeyForSectionRange(range));
	// -------------------
	// FETCH / CACHE
	// -------------------

	const {
		data: sections,
		isLoading: loading,
		error,
		refetch,
		setData,
	} = useCache<SectionSummaries[]>(cacheKey, async () => {
		const { data } = await api.get("/manager/sections/", {
			params,
		});
		return data;
	});

	// -------------------
	// CREATE
	// -------------------
	const { mutate: createSection, isMutating: creatingSection } = useMutation<
		SectionSummaries,
		{ sectionName: SectionName; date?: Date },
		string
	>(
		async (payload: { sectionName: SectionName; date?: Date }) => {
			const { data } = await api.post<SectionSummaries>("/manager/sections/", {
				section: payload.sectionName,
				date: formatDateRequest(payload.date || new Date()),
			});
			return data;
		},
		{
			onSuccess: (data) => {
				syncCachesByDate<SectionSummaries[]>(
					MODEL,
					data.date,
					(prev: SectionSummaries[] | null | undefined) =>
						upsertByDate(prev ?? [], data),
					setData,
					cacheKey,
				);

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "Section created successfully",
				});
			},
			onError: (err) => {
				let message = "Section create failed.";

				// Normalize error
				if (isAxiosError(err)) {
					message = err.response?.data?.detail || message;
				} else if (err instanceof Error) {
					message = err.message;
				}

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Error",
					description: message,
				});
				return message;
			},
		},
	);

	// -------------------
	// EDIT
	// -------------------
	const { mutate: editSection, isMutating: editingSection } = useMutation<
		SectionSummaries,
		{ form: Partial<Section>; id: string },
		ParsedErrors<SectionSummaryEditFields>
	>(
		async ({ form, id }: { form: Partial<Section>; id: string }) => {
			const { data } = await api.put<SectionSummaries>(
				`/manager/sections/${id}/`,
				form,
			);
			return data;
		},
		{
			onSuccess: (data) => {
				syncCachesByDate<SectionSummaries[]>(
					MODEL,
					data.date,
					(prev: SectionSummaries[] | null | undefined) =>
						upsertByDate(prev ?? [], data),
					setData,
					cacheKey,
				);

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "Section edited successfully!",
				});
			},
			onError: (err) => {
				if (isAxiosError(err)) {
					const errors = parseErrors<SectionSummaryEditFields>(
						err?.response?.data || {},
						[
							"draw_number",
							"draw_times",
							"total_amount",
							"total_commission",
							"total_draw_value",
							"total_resold",
						],
					);

					return errors;
				}
				if (err instanceof Error) {
					// Regular JS Error
					return { form: err.message, fields: {} };
				}

				// Unknown / unexpected error
				return { form: "Something went wrong", fields: {} };
			},
		},
	);

	// -------------------
	// DELETE
	// -------------------
	const { mutate: deleteSection, isMutating: deletingSection } = useMutation<
		void,
		{ id: string; date: string },
		string
	>(
		async ({ id }: { id: string; date: string }) =>
			await api.delete(`/manager/sections/${id}/`),
		{
			onSuccess: (_, { date, id }) => {
				const updater = (prev: SectionSummaries[] | null | undefined) => {
					if (!prev) return [];

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
				};

				syncCachesByDate<SectionSummaries[]>(
					MODEL,
					date,
					updater,
					setData,
					cacheKey,
				);

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "Section deleted successfully!",
				});

				eventBus.emit(EVENT_NAMES.ONLINE_ACTION, {
					action: "delete",
					model: MODEL,
					id: id,
					meta: {
						date: date,
					},
				});
			},
			onError: (err) => {
				let message = "Section delete failed.";

				// Normalize error
				if (isAxiosError(err)) {
					message = err.response?.data?.detail || message;
				} else if (err instanceof Error) {
					message = err.message;
				}
				return message;
			},
		},
	);

	// -------------------
	// Listening Events
	// -------------------
	useEffect(() => {
		const handler = async (event: AppEvents["ONLINE_ACTION"]) => {
			if (
				(event.model === "bussinessUsers" && event.action === "delete") ||
				(event.model === "sectionTwoDList" && event.action === "create") ||
				(event.model === "sectionSales" &&
					(event.action === "update" || event.action === "delete"))
			) {
				await refetch();
				queueMicrotask(() => {
					const data = getCache<SectionSummaries[] | null>(cacheKey)?.find(
						(s) => isToday(s.date),
					);
					if (data) {
						syncCachesByDate<SectionSummaries[]>(
							MODEL,
							data.date,
							(prev: SectionSummaries[] | null | undefined) =>
								upsertByDate(prev ?? [], data),
							undefined,
							cacheKey,
						);
					}
				});
			}
		};

		eventBus.on(EVENT_NAMES.ONLINE_ACTION, handler);

		return () => {
			eventBus.off(EVENT_NAMES.ONLINE_ACTION, handler);
		};
	}, [refetch, cacheKey, sections]);

	return {
		sections,
		loading,
		error,
		createSection,
		editSection,
		deleteSection,
		refetch,
		creatingSection,
		editingSection,
		deletingSection,
	};
};

export default useManageHook;
