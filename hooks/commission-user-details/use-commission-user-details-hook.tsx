import { api } from "@/lib/api";
import { formatDateRequest } from "@/lib/helpers";
import {
	CommissionUserType,
	ComUserSectionSaleType,
	SectionSaleGroup,
} from "@/types/commission-user-types";
import { SectionName } from "@/types/manage-types";
import { useState } from "react";

export type ComUserDetailsHookTypes = {
	loading: boolean;
	error: string | null;
	fetchCommissionUserDetails: (
		signal: AbortSignal,
		id: string,
	) => Promise<void>;
	commissionUserDetails: CommissionUserType | null;
	reset: (id: string | undefined) => void;
	createComUserSection: (
		id: string,
		section: SectionName,
		date?: Date,
	) => Promise<void>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;

	fetchSectionSalesForWeek: (
		signal: AbortSignal,
		id: string,
		date?: Date,
	) => Promise<void>;
	weekSectionSales: SectionSaleGroup[] | null;
};

const useCommissionUserDetailsHook = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [commissionUserDetails, setCommissionUserDetails] =
		useState<CommissionUserType | null>(null);

	const [weekSectionSales, setWeekSectionSales] = useState<
		SectionSaleGroup[] | null
	>(null);

	const fetchCommissionUserDetails = async (
		signal: AbortSignal,
		id: string,
	) => {
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get<CommissionUserType>(
				`/commission_users/${id}?date=${formatDateRequest(new Date())}`,
				{ signal },
			);

			if (!signal.aborted) {
				setCommissionUserDetails(data);
			}
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") {
				// Request was cancelled → do nothing
				return;
			}

			setError("Failed to load commission users. Please try again.");
			setCommissionUserDetails(null);
		} finally {
			if (!signal.aborted) {
				setLoading(false);
			}
		}
	};

	const fetchSectionSalesForWeek = async (
		signal: AbortSignal,
		id: string,
		date: Date = new Date(),
	) => {
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get<SectionSaleGroup[]>(
				`/commission_users/${id}/section_sales?date=${formatDateRequest(date)}`,
				{ signal },
			);

			if (!signal.aborted) {
				setWeekSectionSales(data);
			}
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") {
				// Request was cancelled → do nothing
				return;
			}

			setError("Failed to load week Seciton Sales. Please try again.");
			setWeekSectionSales(null);
		} finally {
			if (!signal.aborted) {
				setLoading(false);
			}
		}
	};

	const reset = (id: string | undefined) => {
		setError(null);
		const { signal } = new AbortController();
		if (id) fetchCommissionUserDetails(signal, id);
	};

	const createComUserSection = async (
		id: string,
		section: SectionName,
		date: Date = new Date(),
	) => {
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.post<ComUserSectionSaleType>(
				`/commission_users/${id}/section_sales/`,
				{
					section: section,
					date: formatDateRequest(date),
				},
			);

			setCommissionUserDetails((prev) => {
				if (!prev) return prev;

				// Copy previous state
				const updated = { ...prev };

				// Check which section was created
				if (data.section_summary.section === "morning_section") {
					updated.section_sales.morning_section = data;
				} else if (data.section_summary.section === "evening_section") {
					updated.section_sales.evening_section = data;
				}

				// Update the summary totals
				updated.section_sales.summary.total_amount += data.total_amount;
				updated.section_sales.summary.total_commission += data.total_commission;
				updated.section_sales.summary.profit_or_loss += data.profit_or_loss;
				updated.section_sales.summary.total_draw_amount +=
					data.total_draw_amount;

				return updated;
			});
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") {
				// Request was cancelled → do nothing
				return;
			}

			setError("Failed to load commission users. Please try again.");
			setCommissionUserDetails(null);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		commissionUserDetails,
		fetchCommissionUserDetails,
		reset,
		createComUserSection,
		weekSectionSales,
		fetchSectionSalesForWeek,

		setError,
	};
};

export default useCommissionUserDetailsHook;
