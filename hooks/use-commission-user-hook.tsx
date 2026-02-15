import { api } from "@/lib/api";
import { CommissionUserType } from "@/types/commission-user-types";
import { useCallback, useState } from "react";
import { useAbortableEffect } from "./use-abortable-effect";

export type UseCommissionUserHookType = {
	loading: boolean;
	commissionUsers: CommissionUserType[] | null;
	error: string | null;
	reset: () => void;
	handleCreateCommissionUser: (
		payload: Omit<CommissionUserType, "id" | "manager">,
	) => Promise<void>;
};

const useCommissionUserHook = (): UseCommissionUserHookType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [commissionUsers, setCommissionUsers] = useState<
		CommissionUserType[] | null
	>(null);

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
	const handleCreateCommissionUser = async (
		payload: Omit<CommissionUserType, "id" | "manager">,
	) => {
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

	return {
		loading,
		commissionUsers,
		error,
		reset,
		handleCreateCommissionUser,
	};
};

export default useCommissionUserHook;
