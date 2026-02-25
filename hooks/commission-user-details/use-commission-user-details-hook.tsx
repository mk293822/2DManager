import { api } from "@/lib/api";
import { formatDateRequest } from "@/lib/helpers";
import {
	CommissionUserType,
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
};

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

	return {
		loading,
		error,
		commissionUserDetails,
		fetchCommissionUserDetails,
		reset,
		createComUserSection,
		setError,
	};
};

export default useCommissionUserDetailsHook;
