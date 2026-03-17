import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import { formatDateRequest, ParsedErrors, parseErrors } from "@/lib/helpers";
import { BussinessUser, BussinessUserType } from "@/types/bussiness-user-types";
import { useCallback, useRef, useState } from "react";
import { BussinessUserEditFields } from "../bussiness-user-details/use-user-details-hook";
import { useAbortableEffect } from "../use-abortable-effect";

// Hook return type
export type BussinessUserHookType = {
	loading: boolean; // indicates fetch or mutation in progress
	bussinessUsers: BussinessUser[] | null; // list of users for the current type
	error: string | null; // error messages
	reset: () => void; // refetch the data
	handleCreateBussinessUser: (
		payload: {
			name: string;
			phone_number: string;
			default_commission_percent: number;
		},
		userType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserEditFields>;
	}>;
	deleteBussinessUser: (
		id: string,
		userType: BussinessUserType,
	) => Promise<void>; // delete a user
	fetchBussinessUsers: (
		signal: AbortSignal,
		showLoading?: boolean,
	) => Promise<void>; // manual fetch
};

const useBussinessUserHook = (
	bussinessUserType: BussinessUserType,
): BussinessUserHookType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [bussinessUsers, setBussinessUsers] = useState<BussinessUser[] | null>(
		null,
	);

	// Cache user lists per type to avoid refetching when switching between commission/resold users
	const cacheRef = useRef<Record<BussinessUserType, BussinessUser[] | null>>({
		commission_user: null,
		resold_user: null,
	});

	// Fetch users from API
	const fetchBussinessUsers = useCallback(
		async (signal: AbortSignal, showLoading: boolean = true) => {
			try {
				if (showLoading) setLoading(true);
				setError(null);

				// Use cache if available
				const cached = cacheRef.current[bussinessUserType];
				if (cached) {
					setBussinessUsers(cached);
					return;
				}

				// Determine endpoint based on user type
				const endpoint =
					bussinessUserType === "commission_user"
						? "/commission-users/"
						: "/resold-users/";

				const { data } = await api.get<BussinessUser[]>(endpoint, {
					signal,
					params: {
						date: formatDateRequest(new Date()),
					},
				});

				if (!signal.aborted) {
					setBussinessUsers(data);
					cacheRef.current[bussinessUserType] = data; // cache result
				}
			} catch (err: any) {
				if (err.name === "CanceledError" || err.name === "AbortError") return;
				setError(`Failed to load ${bussinessUserType}. Please try again.`);
				setBussinessUsers([]);
			} finally {
				if (!signal.aborted) setLoading(false);
			}
		},
		[bussinessUserType],
	);

	// Automatically fetch data on mount or when userType changes
	useAbortableEffect(
		(signal) => {
			fetchBussinessUsers(signal);
		},
		[bussinessUserType],
	);

	// Create a new user
	const handleCreateBussinessUser = async (
		payload: {
			name: string;
			phone_number: string;
			default_commission_percent: number;
		},
		userType: BussinessUserType,
	) => {
		try {
			const endpoint =
				userType === "commission_user"
					? "/commission-users/"
					: "/resold-users/";

			const { data } = await api.post<BussinessUser>(endpoint, { ...payload });

			// Update state & cache
			setBussinessUsers((prev) => {
				const updated = prev ? [...prev, data] : [data];
				cacheRef.current[userType] = updated;
				return updated;
			});

			// Notify user
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				title: "Success",
				description: "User created successfully",
			});

			return { success: true, errors: { fields: {} } };
		} catch (err: any) {
			const data = err?.response?.data || {};
			const errors = parseErrors<BussinessUserEditFields>(data, [
				"phone_number",
				"name",
				"default_commission_percent",
			]);
			return { success: false, errors };
		}
	};

	// Delete a user
	const deleteBussinessUser = async (
		id: string,
		userType: BussinessUserType,
	) => {
		try {
			setLoading(true);
			setError(null);

			const endpoint =
				userType === "commission_user"
					? "/commission-users/"
					: "/resold-users/";

			await api.delete(`${endpoint}${id}/`);

			setBussinessUsers((prev) => {
				const updated = prev?.filter((u) => u.id !== id) || [];
				cacheRef.current[userType] = updated; // update cache
				return updated;
			});
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") return;
			setError(`Failed to delete ${userType}. Please try again.`);
		} finally {
			setLoading(false);
		}
	};

	// Reset fetch (refetch data)
	const reset = () => {
		setError(null);
		const { signal } = new AbortController();
		fetchBussinessUsers(signal);
	};

	return {
		loading,
		bussinessUsers,
		error,
		reset,
		handleCreateBussinessUser,
		deleteBussinessUser,
		fetchBussinessUsers,
	};
};

export default useBussinessUserHook;
