import { EVENT_NAMES } from "@/event-names";
import { api, clearTokens, setTokens } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors, parseErrors } from "@/lib/helpers";
import { User } from "@/types/main";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import { useCallback, useState } from "react";
import { useAbortableEffect } from "./use-abortable-effect";

export type ChangePasswordFields =
	| "current_password"
	| "new_password"
	| "confirm_password";

export type LoginFields = "phone_number" | "password";

export type RegisterFields = "phone_number" | "name" | "password";

export type EditUserFields = "name" | "phone_number";

export interface UseAuthInterface {
	user: User | null;
	authLoading: boolean;
	initialized: boolean;
	isAuthenticated: boolean;

	login: (
		phone_number: string,
		password: string,
	) => Promise<{ success: boolean; errors: ParsedErrors<LoginFields> }>;

	register: (
		name: string,
		phone_number: string,
		password: string,
	) => Promise<{ success: boolean; errors: ParsedErrors<RegisterFields> }>;

	logout: () => Promise<void>;

	fetchUser: (
		signal?: AbortSignal,
		showLoading?: boolean,
	) => Promise<User | null>;

	changePassword: (form: {
		current_password: string;
		new_password: string;
		confirm_password: string;
	}) => Promise<{
		success: boolean;
		errors: ParsedErrors<ChangePasswordFields>;
	}>;

	editUserDetails: (form: { name: string; phone_number: string }) => Promise<{
		success: boolean;
		errors: ParsedErrors<EditUserFields>;
	}>;
}

export function useAuth(): UseAuthInterface {
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [initialized, setInitialized] = useState(false);

	/* ---------------- fetch user ---------------- */

	const fetchUser = useCallback(
		async (signal?: AbortSignal, showLoading = true) => {
			if (showLoading) setAuthLoading(true);

			try {
				const { data } = await api.get<User>("/users/profile/", { signal });
				setUser(data);
				return data;
			} catch (err: any) {
				if (signal?.aborted) return null;

				if (err?.response?.status === 401) {
					setUser(null);
					return null;
				}

				const message =
					err?.response?.data?.detail || err?.message || "Unable to fetch user";

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Error",
					description: message,
				});

				setUser(null);
				return null;
			} finally {
				if (showLoading) setAuthLoading(false);
			}
		},
		[],
	);

	/* ---------------- login ---------------- */

	const login = useCallback(
		async (phone_number: string, password: string) => {
			try {
				const { data } = await api.post("/auth/login/", {
					phone_number,
					password,
				});

				await setTokens(data.access, data.refresh);
				await fetchUser();

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "Logged in successfully",
				});

				return { success: true, errors: { fields: {} } };
			} catch (err: any) {
				const data = err?.response?.data || {};

				const errors = parseErrors<LoginFields>(data, [
					"phone_number",
					"password",
				]);

				return { success: false, errors };
			}
		},
		[fetchUser],
	);

	/* ---------------- register ---------------- */

	const register = useCallback(
		async (name: string, phone_number: string, password: string) => {
			try {
				const { data } = await api.post("/users/register/", {
					name,
					phone_number,
					password,
				});

				await setTokens(data.access, data.refresh);

				if (data.user) setUser(data.user);
				else await fetchUser();

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "Account created successfully",
				});

				return { success: true, errors: { fields: {} } };
			} catch (err: any) {
				const data = err?.response?.data || {};

				const errors = parseErrors<RegisterFields>(data, [
					"name",
					"phone_number",
					"password",
				] as any);

				return { success: false, errors };
			}
		},
		[fetchUser],
	);

	/* ---------------- logout ---------------- */

	const logout = useCallback(async () => {
		try {
			const refresh = await SecureStore.getItemAsync("refreshToken");

			if (refresh) {
				await api.post("/auth/logout/", { refresh });
			}
		} catch (err: any) {
			// Optional notification
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Logout Warning",
				description:
					err?.response?.data?.detail ||
					"Server logout failed, but you have been logged out locally.",
			});
		} finally {
			// ALWAYS logout locally
			setUser(null);
			await clearTokens();
			await Updates.reloadAsync();
			router.replace("/login");
		}
	}, []);

	/* ---------------- change password ---------------- */

	const changePassword = async (form: {
		current_password: string;
		new_password: string;
		confirm_password: string;
	}) => {
		try {
			const res = await api.post("/users/change-password/", form);

			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				title: "Success",
				description: res.data.message || "Password changed successfully",
			});

			return { success: true, errors: { fields: {} } };
		} catch (err: any) {
			const data = err?.response?.data || {};

			const errors = parseErrors<ChangePasswordFields>(data, [
				"current_password",
				"new_password",
				"confirm_password",
			]);

			return { success: false, errors };
		}
	};

	/* ---------------- edit profile ---------------- */

	const editUserDetails = async (form: {
		name: string;
		phone_number: string;
	}) => {
		try {
			const { data } = await api.patch<User>("/users/profile/", form);

			setUser(data);

			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				title: "Success",
				description: "Profile updated successfully",
			});

			return { success: true, errors: { fields: {} } };
		} catch (err: any) {
			const data = err?.response?.data || {};

			const errors = parseErrors<EditUserFields>(data, [
				"name",
				"phone_number",
			]);

			return { success: false, errors };
		}
	};

	/* ---------------- init auth ---------------- */

	useAbortableEffect(
		(signal) => {
			const init = async () => {
				await fetchUser(signal);
				setInitialized(true);
			};

			init();
		},
		[fetchUser],
	);

	const isAuthenticated = !!user;

	return {
		user,
		authLoading,
		initialized,
		isAuthenticated,
		login,
		register,
		logout,
		fetchUser,
		changePassword,
		editUserDetails,
	};
}
