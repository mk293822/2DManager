import { api } from "@/lib/api";
import { CommissionUserType } from "@/types/commission-user-types";
import { useState } from "react";

export type ComUserDetailsHookTypes = {
	loading: boolean;
	error: string | null;
	fetch_com_user_details: (signal: AbortSignal, id: string) => Promise<void>;
	commissionUserDetails: CommissionUserType | null;
};

const useCommissionUserDetailsHook = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [commissionUserDetails, setCommissionUserDetails] =
		useState<CommissionUserType | null>(null);
	const fetch_com_user_details = async (signal: AbortSignal, id: string) => {
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get<CommissionUserType>(
				`/commission_users/${id}/`,
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
	return {
		loading,
		error,
		commissionUserDetails,
		fetch_com_user_details,
	};
};

export default useCommissionUserDetailsHook;
