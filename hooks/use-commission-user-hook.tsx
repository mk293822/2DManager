import { api } from "@/lib/api";
import { CommissionUserType } from "@/types/commission-user-types";
import { useCallback, useState } from "react";
import { useAbortableEffect } from "./use-abortable-effect";

export type UseCommissionUserHookType = {
	loading: boolean;
	commissionUsers: CommissionUserType[] | null;
	error: string | null;
	reset: () => void;
	handleCreateCommissionUser: (payload: {
		name: string;
		phone_number: string;
	}) => Promise<void>;
	fetch_com_user_details: (signal: AbortSignal, id: string) => Promise<void>;
	commissionUserDetails: CommissionUserType | null;
};

const useCommissionUserHook = (): UseCommissionUserHookType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [commissionUsers, setCommissionUsers] = useState<
		CommissionUserType[] | null
	>(null);
	const [commissionUserDetails, setCommissionUserDetails] =
		useState<CommissionUserType | null>(null);

	const fetchCommissionUser = useCallback(async (signal: AbortSignal) => {
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get<CommissionUserType[]>(
				"/commission_users/",
				{ signal },
			);

			if (!signal.aborted) {
				setCommissionUsers(data);
			}
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") {
				// Request was cancelled → do nothing
				return;
			}

			setError("Failed to load commission users. Please try again.");
			setCommissionUsers([]);
		} finally {
			if (!signal.aborted) {
				setLoading(false);
			}
		}
	}, []);

	// Date change
	useAbortableEffect((signal) => {
		fetchCommissionUser(signal);
	}, []);

	// Create
	const handleCreateCommissionUser = async (payload: {
		name: string;
		phone_number: string;
	}) => {
		setLoading(true);
		try {
			const { data } = await api.post<CommissionUserType>(
				"/commission_users/",
				{
					...payload,
				},
			);
			setCommissionUsers((pre) => {
				if (!pre) return [data];
				return [...pre, data];
			});
		} catch {
			setError("Failed to create commission user");
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setError(null);
		const { signal } = new AbortController();
		fetchCommissionUser(signal);
	};

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
		commissionUsers,
		error,
		reset,
		handleCreateCommissionUser,
		commissionUserDetails,
		fetch_com_user_details,
	};
};

export default useCommissionUserHook;
