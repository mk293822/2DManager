import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import {
	createKey,
	getDayKeyFromDate,
	getParamsForSectionRange,
	getWeekKeyFromDate,
	syncCachesByDate,
} from "@/lib/cache-helper";
import { calculateSectionSaleSummary } from "@/lib/calculate-summary";
import { getWeekRangeFromDate } from "@/lib/datetime-helper";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors, parseErrors } from "@/lib/helpers";
import {
	BussinessUser,
	BussinessUserType,
	SectionSaleGroup,
} from "@/types/bussiness-user-types";
import { AppEvents } from "@/types/event-bus";
import { DayRange, WeekRange } from "@/types/manage-types";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { BussinessUserEditFields } from "../bussiness-user-details/use-bussiness-user-details-hook";
import { getErrorMessage, updateCache, useCache } from "../use-cache";
import { MutationResult, useMutation } from "../use-mutation";

// -------------------------
// Hook return type
// -------------------------
export type BussinessUserHookType = {
	loading: boolean;
	bussinessUsers: BussinessUser[] | null;
	error: Error | null;
	createBussinessUser: (
		variables: Partial<BussinessUser>,
	) => Promise<
		MutationResult<BussinessUser, ParsedErrors<BussinessUserEditFields>>
	>;

	deleteBussinessUser: (id: string) => Promise<MutationResult<void, string>>;

	creatingUser: boolean;
	deletingUser: boolean;

	refetch: () => Promise<void>;
};

const MODEL = "bussinessUsers";

// -------------------------
// Hook implementation
// -------------------------
const useBussinessUserHook = (
	bussinessUserType: BussinessUserType,
): BussinessUserHookType => {
	const cacheKey = createKey("bussinessUsers", {
		userType: bussinessUserType,
	});
	// -------------------
	// STATE
	// -------------------
	const endpoint =
		bussinessUserType === "commission_user"
			? "/commission-users/"
			: "/resold-users/";

	const {
		data: bussinessUsers,
		isLoading: loading,
		error,
		refetch,
		setData,
	} = useCache<BussinessUser[]>(cacheKey, async () => {
		const { data } = await api.get<BussinessUser[]>(endpoint);
		return data;
	});

	// -------------------
	// CREATE
	// -------------------
	const { mutate: createBussinessUser, isMutating: creatingUser } = useMutation<
		BussinessUser,
		Partial<BussinessUser>,
		ParsedErrors<BussinessUserEditFields>
	>(
		async (payload) => {
			const { data } = await api.post<BussinessUser>(endpoint, payload);
			return data;
		},
		{
			onSuccess: (data) => {
				setData((prev) => (prev ? [...prev, data] : [data]));

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "User created successfully",
				});
			},
			onError: (err) => {
				if (isAxiosError(err)) {
					const errors = parseErrors<Partial<BussinessUserEditFields>>(
						err?.response?.data || {},
						[
							"name",
							"phone_number",
							"default_commission_percent",
							"default_draw_times",
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
	const { mutate: deleteBussinessUser, isMutating: deletingUser } = useMutation<
		void,
		string,
		string
	>(
		async (id) => {
			await api.delete(`${endpoint}${id}/`);
		},
		{
			onSuccess: (_, id) => {
				setData((prev) => (prev ? prev.filter((u) => u.id !== id) : []));
				eventBus.emit(EVENT_NAMES.ONLINE_ACTION, {
					action: "delete",
					model: MODEL,
					id: id,
					meta: {
						bussinessUserType: bussinessUserType,
					},
				});
			},
			onError: (err) => {
				let message = "Delete failed.";

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
		const handleSectionSummaryDelete = (event: AppEvents["ONLINE_ACTION"]) => {
			if (
				event.model === "sectionSummaries" &&
				event.action === "delete" &&
				event.meta?.date
			) {
				const updater = (prev: SectionSaleGroup[] | null | undefined) => {
					if (!prev) return [];
					return prev.map((day) => {
						if (day.date !== event.meta?.date) return day;

						const morning =
							day.morning_section?.section_summary_id === event.id
								? null
								: day.morning_section;
						const evening =
							day.evening_section?.section_summary_id === event.id
								? null
								: day.evening_section;

						const summary = calculateSectionSaleSummary(morning, evening);

						return {
							...day,
							summary,
							morning_section: morning,
							evening_section: evening,
						};
					});
				};
				const userIds = bussinessUsers?.map((u) => u.id) ?? [];

				for (const id of userIds) {
					syncCachesByDate<SectionSaleGroup[]>(
						"sectionSales",
						event.meta.date,
						updater,
						undefined,
						undefined,
						{
							id: id,
							userType: bussinessUserType,
						},
					);
				}
			}
		};

		const handleSectionSummaryUpdate = (event: AppEvents["ONLINE_ACTION"]) => {
			if (
				event.model === "sectionSummaries" &&
				event.action === "update" &&
				event.meta?.date
			) {
				const userIds = bussinessUsers?.map((u) => u.id) ?? [];

				for (const id of userIds) {
					const userKey = createKey("bussinessUser", {
						id,
						userType: bussinessUserType,
					});

					const endpoint =
						bussinessUserType === "commission_user"
							? `/commission-users/${id}/`
							: `/resold-users/${id}/`;
					api
						.get<BussinessUser>(endpoint)
						.then((res) => {
							updateCache<BussinessUser>(userKey, () => res.data);
						})
						.catch((err) => {
							eventBus.emit(EVENT_NAMES.NOTIFICATION, {
								type: "error",
								title: "Errot",
								description: getErrorMessage(err),
							});
						});

					const dayKey = getDayKeyFromDate("sectionSales", event.meta.date, {
						id,
						userType: bussinessUserType,
					});
					const weekKey = getWeekKeyFromDate("sectionSales", event.meta.date, {
						id,
						userType: bussinessUserType,
					});

					const dayRange: DayRange = {
						type: "day",
						date: new Date(event.meta.date),
					};

					const { start, end } = getWeekRangeFromDate(event.meta.date);

					const weekRange: WeekRange = {
						type: "week",
						start_date: start,
						end_date: end,
					};

					[dayRange, weekRange].forEach((range) => {
						const params = getParamsForSectionRange(range);
						const sectionEndpoint =
							bussinessUserType === "commission_user"
								? `/commission-users/${id}/section-sales/`
								: `/resold-users/${id}/section-sales/`;
						api
							.get<SectionSaleGroup[]>(sectionEndpoint, {
								params,
							})
							.then((res) => {
								if (range.type === "day") {
									updateCache<SectionSaleGroup[]>(dayKey, () => res.data);
								}
								if (range.type === "week") {
									updateCache<SectionSaleGroup[]>(weekKey, () => res.data);
								}
							})
							.catch((err) => {
								eventBus.emit(EVENT_NAMES.NOTIFICATION, {
									type: "error",
									title: "Errot",
									description: getErrorMessage(err),
								});
							});
					});
				}
			}
		};

		eventBus.on(EVENT_NAMES.ONLINE_ACTION, handleSectionSummaryDelete);
		eventBus.on(EVENT_NAMES.ONLINE_ACTION, handleSectionSummaryUpdate);

		return () => {
			eventBus.off(EVENT_NAMES.ONLINE_ACTION, handleSectionSummaryDelete);
			eventBus.off(EVENT_NAMES.ONLINE_ACTION, handleSectionSummaryUpdate);
		};
	}, [bussinessUserType, cacheKey, bussinessUsers]);

	return {
		loading,
		bussinessUsers,
		error,
		refetch,
		createBussinessUser,
		deleteBussinessUser,
		creatingUser,
		deletingUser,
	};
};

export default useBussinessUserHook;
