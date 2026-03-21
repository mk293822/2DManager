import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import { calculateSectionSaleSummary } from "@/lib/calculate-summary";
import { eventBus } from "@/lib/event-bus";
import {
	formatDateRequest,
	isToday,
	ParsedErrors,
	parseErrors,
	upsertByDate,
} from "@/lib/helpers";
import {
	BussinessUser,
	BussinessUserType,
	SectionSale,
	SectionSaleGroup,
} from "@/types/bussiness-user-types";
import { SectionName, SectionRange } from "@/types/manage-types";
import { useRef, useState } from "react";
import { useBussinessUserContext } from "../bussiness-users/use-context";

// Fields that can be edited for a bussiness user
export type BussinessUserEditFields =
	| "name"
	| "phone_number"
	| "default_commission_percent"
	| "default_draw_times_percent"
	| "manager_name"
	| "default_draw_times";

// Hook return type definition
export type BussinessUserDetailsHookType = {
	loading: boolean;
	error: string | null;
	bussinessUserDetails: BussinessUser | null;
	fetchBussinessUserDetails: (
		signal: AbortSignal,
		id: string,
		showLoading?: boolean,
	) => Promise<void>;
	reset: (id: string | undefined) => void;
	createBussinessUserSection: (
		id: string,
		section: SectionName,
		bussinessUserType: BussinessUserType,
		date?: Date,
	) => Promise<void>;
	editBussinessUserDetails: (
		id: string,
		form: Partial<BussinessUser>,
		bussinessUserType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserEditFields>;
	}>;
	deleteBussinessUserSection: (
		id: string,
		bussinessUserId: string,
		section: SectionName,
		bussinessUserType: BussinessUserType,
		date: string,
	) => Promise<void>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	bussinessUserType: BussinessUserType;
	fetchSectionSales: (
		signal: AbortSignal,
		id: string,
		sectionRange: SectionRange,
		bussinessUserType: BussinessUserType,
		showLoading?: boolean,
	) => Promise<void>;
	sectionSales: SectionSaleGroup[] | null;
	editBussinessUserSection: (
		id: string,
		userId: string,
		form: Partial<SectionSale>,
		bussinessUserType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserSectionEditFields>;
	}>;
};

export type BussinessUserSectionEditFields =
	| "commission_percent"
	| "total_amount"
	| "total_draw_value"
	| "draw_times";

// Custom hook to manage bussiness user details
const useBussinessUserDetailsHook = () => {
	const [loading, setLoading] = useState(false); // Loading state
	const [error, setError] = useState<string | null>(null); // Error state
	const [bussinessUserDetails, setBussinessUserDetails] =
		useState<BussinessUser | null>(null); // User details state
	const { bussinessUserType } = useBussinessUserContext();
	const [sectionSales, setSectionSales] = useState<SectionSaleGroup[] | null>(
		null,
	);

	// Cache to store user details per id to avoid unnecessary API calls
	const cacheRef = useRef<Record<string, BussinessUser | null>>({});

	const editBussinessUserSection = async (
		id: string,
		userId: string,
		form: Partial<SectionSale>,
		bussinessUserType: BussinessUserType,
	) => {
		try {
			setError(null);

			const endpoint =
				bussinessUserType === "commission_user"
					? `/commission-users/${userId}/section-sales/${id}/`
					: `/resold-users/${userId}/section-sales/${id}/`;

			const { data } = await api.put<SectionSaleGroup>(endpoint, form);

			setSectionSales((prev) => upsertByDate<SectionSaleGroup>(prev, data));

			if (isToday(data.date)) {
				setBussinessUserDetails((prev) => {
					if (!prev) return prev;
					const updated = {
						...prev,
						section_sales: data,
					};
					cacheRef.current[userId] = updated;
					return updated;
				});
			}

			// Notify success
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				title: "Success",
				description: `Section edited successfully`,
			});

			return { success: true, errors: { fields: {} } };
		} catch (err: any) {
			const data = err?.response?.data || {};
			const errors = parseErrors<BussinessUserSectionEditFields>(data, [
				"total_amount",
				"commission_percent",
				"total_draw_value",
			]);
			return { success: false, errors };
		}
	};

	const fetchSectionSales = async (
		signal: AbortSignal,
		id: string,
		sectionRange: SectionRange,
		bussinessUserType: BussinessUserType,
		showLoading: boolean = true,
	) => {
		try {
			if (showLoading) setLoading(true);
			setError(null);

			const endpoint =
				bussinessUserType === "commission_user"
					? "commission-users"
					: "resold-users";

			const { data } = await api.get(`/${endpoint}/${id}/section-sales/`, {
				signal,
				params:
					sectionRange.type === "day"
						? { type: "day", date: formatDateRequest(sectionRange.date) }
						: { ...sectionRange, month: sectionRange.month + 1 },
			});

			if (!signal.aborted) {
				const sectionsArray: SectionSaleGroup[] =
					sectionRange.type === "day" ? [data] : data;
				setSectionSales(sectionsArray);
			}
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") {
				// Request was cancelled → do nothing
				return;
			}

			setError("Failed to load section sales. Please try again.");
			setSectionSales(null);
		} finally {
			if (!signal.aborted) {
				setLoading(false);
			}
		}
	};

	/**
	 * Fetch bussiness user details from API
	 * Uses cache if available
	 */

	const fetchBussinessUserDetails = async (
		signal: AbortSignal,
		id: string,
		showLoading: boolean = true,
	) => {
		try {
			if (showLoading) setLoading(true);
			setError(null);

			// Return cached data if available
			if (cacheRef.current[id] && showLoading) {
				setBussinessUserDetails(cacheRef.current[id]);
				return;
			}

			const endpoint =
				bussinessUserType === "commission_user"
					? `/commission-users/${id}/`
					: `/resold-users/${id}/`;

			// API request
			const { data } = await api.get<BussinessUser>(
				`${endpoint}?date=${formatDateRequest(new Date())}`,
				{ signal },
			);

			if (!signal.aborted) {
				setBussinessUserDetails(data);
				cacheRef.current[id] = data; // Cache fetched data
			}
		} catch (err: any) {
			// Ignore abort errors
			if (err.name === "CanceledError" || err.name === "AbortError") return;

			setError(`Failed to load ${bussinessUserType}. Please try again.`);
			setBussinessUserDetails(null);
		} finally {
			if (!signal.aborted) setLoading(false);
		}
	};

	/**
	 * Edit bussiness user details
	 * Returns success status and parsed errors
	 */
	const editBussinessUserDetails = async (
		id: string,
		form: Partial<BussinessUser>,
		bussinessUserType: BussinessUserType,
	) => {
		try {
			setError(null);

			const endpoint =
				bussinessUserType === "commission_user"
					? `/commission-users/${id}/`
					: `/resold-users/${id}/`;

			const { data } = await api.put<BussinessUser>(endpoint, form);

			setBussinessUserDetails(data);
			cacheRef.current[id] = data;

			// Notify success
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				title: "Success",
				description: `${bussinessUserType.replace("_", " ")} edited successfully`,
			});

			return { success: true, errors: { fields: {} } };
		} catch (err: any) {
			const data = err?.response?.data || {};
			const errors = parseErrors<BussinessUserEditFields>(data, [
				"name",
				"phone_number",
				"default_commission_percent",
				"default_draw_times_percent",
				"manager_name",
			]);
			return { success: false, errors };
		}
	};

	/**
	 * Reset / refetch user details
	 */
	const reset = (id: string | undefined) => {
		setError(null);
		if (id) {
			const { signal } = new AbortController();
			fetchBussinessUserDetails(signal, id);
		}
	};

	/**
	 * Create a new section for the bussiness user
	 */
	const createBussinessUserSection = async (
		id: string,
		section: SectionName,
		bussinessUserType: BussinessUserType,
		date: Date = new Date(),
	) => {
		try {
			setError(null);

			const endpoint =
				bussinessUserType === "commission_user"
					? `/commission-users/${id}/section-sales/`
					: `/resold-users/${id}/section-sales/`;

			const { data } = await api.post<SectionSaleGroup>(endpoint, {
				section,
				date: formatDateRequest(date),
			});

			// Update state and cache
			setSectionSales((prev) => upsertByDate(prev, data));

			if (isToday(data.date)) {
				setBussinessUserDetails((prev) => {
					if (!prev) return prev;
					const updated = { ...prev, section_sales: data };
					cacheRef.current[id] = updated;
					return updated;
				});
			}
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") return;

			setError("Failed to create section sale. Please try again.");
			setBussinessUserDetails(null);
		}
	};

	/**
	 * Delete a section for the bussiness user
	 */
	const deleteBussinessUserSection = async (
		id: string,
		bussinessUserId: string,
		section: SectionName,
		bussinessUserType: BussinessUserType,
		date: string,
	) => {
		try {
			setError(null);

			const endpoint =
				bussinessUserType === "commission_user"
					? `/commission-users/${bussinessUserId}/section-sales/${id}/`
					: `/resold-users/${bussinessUserId}/section-sales/${id}/`;

			await api.delete(endpoint);

			setSectionSales((prev) => {
				if (!prev) return prev;
				return prev.map((day) => {
					const morning =
						day.morning_section?.id === id ? null : day.morning_section;

					const evening =
						day.evening_section?.id === id ? null : day.evening_section;

					const summary = calculateSectionSaleSummary(morning, evening);

					const updated = {
						...day,
						section_sales: {
							...day,
							[section]: null,
							summary,
						},
					};

					return updated;
				});
			});

			if (isToday(date)) {
				setBussinessUserDetails((prev) => {
					if (!prev) return prev;

					const day = prev.section_sales;

					const morning =
						day.morning_section?.id === id ? null : day.morning_section;

					const evening =
						day.evening_section?.id === id ? null : day.evening_section;

					const summary = calculateSectionSaleSummary(morning, evening);

					const updated = {
						...prev,
						section_sales: {
							...day,
							[section]: null,
							summary,
						},
					};

					// ✅ update cache with fresh value
					cacheRef.current[bussinessUserId] = updated;

					return updated;
				});
			}
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") return;

			setError("Failed to delete section sale. Please try again.");
			setBussinessUserDetails(null);
		}
	};

	return {
		loading,
		error,
		bussinessUserDetails,
		fetchBussinessUserDetails,
		reset,
		createBussinessUserSection,
		editBussinessUserDetails,
		deleteBussinessUserSection,
		setError,
		bussinessUserType,
		editBussinessUserSection,
		sectionSales,
		fetchSectionSales,
	};
};

export default useBussinessUserDetailsHook;
