// hooks/useBussinessUserSectionsHook.ts
import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import {
	createKey,
	getKeyForSectionRange,
	getParamsForSectionRange,
	syncCachesByDate,
} from "@/lib/cache-helper";
import { calculateSectionSaleSummary } from "@/lib/calculate-summary";
import { formatDateRequest, isToday } from "@/lib/datetime-helper";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors, parseErrors, upsertByDate } from "@/lib/helpers";
import {
	BussinessUserType,
	SectionSale,
	SectionSaleGroup,
} from "@/types/bussiness-user-types";
import { AppEvents } from "@/types/event-bus";
import { SectionName, SectionRange } from "@/types/manage-types";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { getCache, useCache } from "../use-cache";
import { MutationResult, useMutation } from "../use-mutation";

export type BussinessUserSectionEditFields =
	| "commission_percent"
	| "total_amount"
	| "total_draw_value"
	| "draw_times";

export type BussinessUserSectionHookType = {
	sectionSaleLoading: boolean;
	secitonSalesError: Error | null;
	sectionSales: SectionSaleGroup[] | null;

	refetchSectionSales: () => Promise<void>;

	createBussinessUserSection: (variables: {
		section: SectionName;
		date: Date;
	}) => Promise<MutationResult<SectionSaleGroup, string>>;
	editBussinessUserSection: (variables: {
		sectionId: string;
		form: Partial<SectionSale>;
	}) => Promise<
		MutationResult<
			SectionSaleGroup,
			ParsedErrors<BussinessUserSectionEditFields>
		>
	>;
	deleteBussinessUserSection: (variables: {
		sectionId: string;
		date: string;
	}) => Promise<MutationResult<void, string>>;
	creatingSection: boolean;
	editingSection: boolean;
	deletingSection: boolean;
	todaySectionSales: SectionSaleGroup;
};

const MODEL = "sectionSales" as const;

const useBussinessUserSectionsHook = (
	id: string,
	range: SectionRange,
	bussinessUserType: BussinessUserType,
): BussinessUserSectionHookType => {
	const params = getParamsForSectionRange(range);
	const cacheKey = createKey(MODEL, {
		...getKeyForSectionRange(range),
		id: id,
		userType: bussinessUserType,
	});
	// -------------------
	// CACHES
	// -------------------

	const {
		data: sectionSales,
		setData: setSectionSales,
		isLoading: sectionSaleLoading,
		refetch: refetchSectionSales,
		error: secitonSalesError,
	} = useCache<SectionSaleGroup[]>(cacheKey, async () => {
		const endpoint =
			bussinessUserType === "commission_user"
				? `/commission-users/${id}/section-sales/`
				: `/resold-users/${id}/section-sales/`;
		const { data } = await api.get<SectionSaleGroup[]>(endpoint, { params });
		return data;
	});

	// -------------------
	// MUTATIONS
	// -------------------
	const { mutate: createBussinessUserSection, isMutating: creatingSection } =
		useMutation<SectionSaleGroup, { section: SectionName; date: Date }, string>(
			async (payload: { section: SectionName; date: Date }) => {
				const endpoint =
					bussinessUserType === "commission_user"
						? `/commission-users/${id}/section-sales/`
						: `/resold-users/${id}/section-sales/`;
				const { data } = await api.post<SectionSaleGroup>(endpoint, {
					section: payload.section,
					date: formatDateRequest(payload.date),
				});
				return data;
			},
			{
				onSuccess: (data) => {
					syncCachesByDate<SectionSaleGroup[]>(
						MODEL,
						data.date,
						(prev: SectionSaleGroup[] | null | undefined) =>
							upsertByDate(prev ?? [], data),
						setSectionSales,
						cacheKey,
						{
							id,
							userType: bussinessUserType,
						},
					);

					eventBus.emit(EVENT_NAMES.NOTIFICATION, {
						type: "success",
						title: "Success",
						description: "Section created successfully",
					});
				},
				onError: (err) => {
					let message = "Section creation failed.";

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

	const { mutate: editBussinessUserSection, isMutating: editingSection } =
		useMutation<
			SectionSaleGroup,
			{ sectionId: string; form: Partial<SectionSale> },
			ParsedErrors<BussinessUserSectionEditFields>
		>(
			async (payload: { sectionId: string; form: Partial<SectionSale> }) => {
				const endpoint =
					bussinessUserType === "commission_user"
						? `/commission-users/${id}/section-sales/${payload.sectionId}/`
						: `/resold-users/${id}/section-sales/${payload.sectionId}/`;
				const { data } = await api.put<SectionSaleGroup>(
					endpoint,
					payload.form,
				);
				return data;
			},
			{
				onSuccess: (data, { sectionId }) => {
					syncCachesByDate<SectionSaleGroup[]>(
						MODEL,
						data.date,
						(prev: SectionSaleGroup[] | null | undefined) =>
							upsertByDate(prev ?? [], data),
						setSectionSales,
						cacheKey,
						{
							id,
							userType: bussinessUserType,
						},
					);
					eventBus.emit(EVENT_NAMES.NOTIFICATION, {
						type: "success",
						title: "Success",
						description: "Section updated successfully",
					});
					eventBus.emit(EVENT_NAMES.ONLINE_ACTION, {
						action: "update",
						model: MODEL,
						id: sectionId,
						meta: {
							bussinessUserType: bussinessUserType,
							user_id: id,
							date: data.date,
						},
					});
				},
				onError: (err) => {
					if (isAxiosError(err)) {
						const errors = parseErrors<BussinessUserSectionEditFields>(
							err?.response?.data || {},
							[
								"commission_percent",
								"total_amount",
								"total_draw_value",
								"draw_times",
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

	const { mutate: deleteBussinessUserSection, isMutating: deletingSection } =
		useMutation<void, { sectionId: string; date: string }, string>(
			async ({ sectionId }: { sectionId: string; date: string }) => {
				const endpoint =
					bussinessUserType === "commission_user"
						? `/commission-users/${id}/section-sales/${sectionId}/`
						: `/resold-users/${id}/section-sales/${sectionId}/`;
				await api.delete(endpoint);
			},
			{
				onSuccess: (_, { sectionId, date }) => {
					const updater = (prev: SectionSaleGroup[] | null | undefined) => {
						if (!prev) return [];
						return prev?.map((day) => {
							const morning =
								day.morning_section?.id === sectionId
									? null
									: day.morning_section;
							const evening =
								day.evening_section?.id === sectionId
									? null
									: day.evening_section;
							const summary = calculateSectionSaleSummary(morning, evening);
							return {
								date: day.date,
								summary,
								morning_section: morning,
								evening_section: evening,
							};
						});
					};
					syncCachesByDate<SectionSaleGroup[]>(
						MODEL,
						date,
						updater,
						setSectionSales,
						cacheKey,
						{
							id,
							userType: bussinessUserType,
						},
					);
					eventBus.emit(EVENT_NAMES.NOTIFICATION, {
						type: "success",
						title: "Success",
						description: "Section deleted successfully",
					});

					eventBus.emit(EVENT_NAMES.ONLINE_ACTION, {
						action: "delete",
						model: MODEL,
						id: sectionId,
						meta: {
							bussinessUserType: bussinessUserType,
							user_id: id,
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

	const todaySectionSales: SectionSaleGroup = sectionSales?.find((s) =>
		isToday(s.date),
	) ?? {
		date: new Date().toDateString(),
		summary: {
			total_amount: 0,
			total_commission: 0,
			total_draw_amount: 0,
			total_draw_value: 0,
			profit_or_loss: 0,
		},
		morning_section: null,
		evening_section: null,
	};

	// -------------------
	// Listening Events
	// -------------------
	useEffect(() => {
		const handler = async (event: AppEvents["ONLINE_ACTION"]) => {
			if (event.model === "sectionTwoDList" && event.action === "create") {
				await refetchSectionSales();
				queueMicrotask(() => {
					const data = getCache<SectionSaleGroup[] | null>(cacheKey)?.find(
						(s) => isToday(s.date),
					);
					if (data) {
						syncCachesByDate<SectionSaleGroup[]>(
							MODEL,
							data.date,
							(prev: SectionSaleGroup[] | null | undefined) =>
								upsertByDate(prev ?? [], data),
							undefined,
							cacheKey,
							{
								id,
								userType: bussinessUserType,
							},
						);
					}
				});
			}
		};

		eventBus.on(EVENT_NAMES.ONLINE_ACTION, handler);

		return () => {
			eventBus.off(EVENT_NAMES.ONLINE_ACTION, handler);
		};
	}, [cacheKey, sectionSales, refetchSectionSales]);

	return {
		sectionSales,
		createBussinessUserSection,
		editBussinessUserSection,
		deleteBussinessUserSection,
		creatingSection,
		editingSection,
		deletingSection,
		sectionSaleLoading,
		secitonSalesError,
		refetchSectionSales,
		todaySectionSales,
	};
};

export default useBussinessUserSectionsHook;
