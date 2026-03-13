import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import { formatDateRequest, ParsedErrors, parseErrors } from "@/lib/helpers";
import { CommissionUserType } from "@/types/commission-user-types";
import { useCallback, useState } from "react";
import { CommissionUserEditFields } from "../commission-user-details/use-commission-user-details-hook";
import { useAbortableEffect } from "../use-abortable-effect";

export type CommissionUserHookType = {
	loading: boolean;
	commissionUsers: CommissionUserType[] | null;
	error: string | null;
	reset: () => void;
	handleCreateCommissionUser: (payload: {
		name: string;
		phone_number: string;
		default_commission_percent: number;
	}) => Promise<{
		success: boolean;
		errors: ParsedErrors<CommissionUserEditFields>;
	}>;
	deleteCommissionUser: (id: string) => Promise<void>;
	fetchCommissionUsers: (signal: AbortSignal) => Promise<void>;
};

const useCommissionUserHook = (): CommissionUserHookType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [commissionUsers, setCommissionUsers] = useState<
		CommissionUserType[] | null
	>(null);

	const fetchCommissionUsers = useCallback(async (signal: AbortSignal) => {
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get<CommissionUserType[]>(
				"/commission-users/",
				{
					signal,
					params: {
						date: formatDateRequest(new Date()),
					},
				},
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
		fetchCommissionUsers(signal);
	}, []);

	// Create
	const handleCreateCommissionUser = async (payload: {
		name: string;
		phone_number: string;
		default_commission_percent: number;
	}) => {
		console.log(payload);
		try {
			const { data } = await api.post<CommissionUserType>(
				"/commission-users/",
				{
					...payload,
				},
			);

			setCommissionUsers((pre) => {
				if (!pre) return [data];
				return [...pre, data];
			});
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				title: "Success",
				description: "Commission User created successfully",
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

	const deleteCommissionUser = async (id: string) => {
		try {
			setLoading(true);
			setError(null);

			await api.delete(`/commission-users/${id}/`);

			setCommissionUsers((pre) => pre?.filter((u) => u.id !== id) || []);
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") {
				// Request was cancelled → do nothing
				return;
			}

			setError("Failed to delete commission users. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setError(null);
		const { signal } = new AbortController();
		fetchCommissionUsers(signal);
	};

	return {
		loading,
		commissionUsers,
		error,
		reset,
		handleCreateCommissionUser,
		deleteCommissionUser,
		fetchCommissionUsers,
	};
};

export default useCommissionUserHook;
