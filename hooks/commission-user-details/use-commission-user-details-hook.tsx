import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import {
	calculateSummary,
	formatDateRequest,
	ParsedErrors,
	parseErrors,
} from "@/lib/helpers";
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
	editCommissionUserDetails: (
		id: string,
		form: {
			name: string;
			phone_number: string;
			default_commission_percent: number;
		},
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<CommissionUserEditFields>;
	}>;
	deleteComUserSection: (
		id: string,
		userId: string,
		section: SectionName,
	) => Promise<void>;
};

export type CommissionUserEditFields =
	| "name"
	| "phone_number"
	| "default_commission_percent";

const useCommissionUserDetailsHook = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [commissionUserDetails, setCommissionUserDetails] =
		useState<CommissionUserType | null>(null);

	const fetchCommissionUserDetails = async (
		signal: AbortSignal,
		id: string,
	) => {
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get<CommissionUserType>(
				`/commission-users/${id}/?date=${formatDateRequest(new Date())}`,
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

	const editCommissionUserDetails = async (
		id: string,
		form: {
			name: string;
			phone_number: string;
			default_commission_percent: number;
		},
	) => {
		try {
			setError(null);

			const { data } = await api.put<CommissionUserType>(
				`/commission-users/${id}/`,
				{ ...form },
			);

			setCommissionUserDetails(data);
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				title: "Success",
				description: "Commission User edited successfully",
			});

			return { success: true, errors: { fields: {} } };
		} catch (err: any) {
			const data = err?.response?.data || {};

			const errors = parseErrors<CommissionUserEditFields>(data, [
				"phone_number",
				"name",
				"default_commission_percent",
			]);

			return { success: false, errors };
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
			setError(null);

			const { data } = await api.post<SectionSaleGroup>(
				`/commission-users/${id}/section-sales/`,
				{
					section: section,
					date: formatDateRequest(date),
				},
			);

			setCommissionUserDetails((prev) => {
				if (!prev) return prev;

				return {
					...prev,
					section_sales: data,
				};
			});
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") return;

			setError("Failed to create section sale. Please try again.");
			setCommissionUserDetails(null);
		}
	};

	const deleteComUserSection = async (
		id: string,
		userId: string,
		section: SectionName,
	) => {
		try {
			setError(null);

			await api.delete(`/commission-users/${userId}/section-sales/${id}/`);

			setCommissionUserDetails((prev) => {
				if (!prev) return prev;
				const day = prev.section_sales;
				const morning =
					day.morning_section?.id === id ? null : day.morning_section;

				const evening =
					day.evening_section?.id === id ? null : day.evening_section;

				const summary = calculateSummary<ComUserSectionSaleType>(
					morning,
					evening,
				);
				return {
					...prev,
					section_sales: { ...day, [section]: null, summary: summary },
				};
			});
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") return;

			setError("Failed to delete section sale. Please try again.");
			setCommissionUserDetails(null);
		}
	};

	return {
		loading,
		error,
		commissionUserDetails,
		fetchCommissionUserDetails,
		reset,
		createComUserSection,
		setError,
		editCommissionUserDetails,
		deleteComUserSection,
	};
};

export default useCommissionUserDetailsHook;
