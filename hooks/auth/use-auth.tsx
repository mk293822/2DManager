import { EVENT_NAMES } from "@/event-names";
import { api, clearAuthQueue, clearTokens, setTokens } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors, parseErrors } from "@/lib/helpers";
import { User } from "@/types/main";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import { useAbortableEffect } from "../use-abortable-effect";
import { clearAllCache, getErrorMessage } from "../use-cache";
import { MutationResult, useMutation } from "../use-mutation";

export type ChangePasswordFields =
	| "current_password"
	| "new_password"
	| "confirm_password";

export type LoginFields = "phone_number" | "password";

export type RegisterFields = "phone_number" | "name" | "password";

export type EditUserFields = "name" | "phone_number";

type Tokens = { refresh: string; access: string };

type UserWithTokens = {
	user: User;
	access: string;
	refresh: string;
};

export interface UseAuthInterface {
	user: User | null;
	authLoading: boolean;

	login: (variables: {
		phone_number: string;
		password: string;
	}) => Promise<MutationResult<Tokens, ParsedErrors<LoginFields>>>;

	register: (variables: {
		name: string;
		phone_number: string;
		password: string;
	}) => Promise<MutationResult<UserWithTokens, ParsedErrors<RegisterFields>>>;

	logout: () => Promise<void>;

	changePassword: (variables: {
		current_password: string;
		new_password: string;
		confirm_password: string;
	}) => Promise<MutationResult<void, ParsedErrors<ChangePasswordFields>>>;

	editUserDetails: (variables: {
		name: string;
		phone_number: string;
	}) => Promise<MutationResult<User, ParsedErrors<EditUserFields>>>;

	loggingIn: boolean;
	registering: boolean;
	changingPassword: boolean;
	updatingProfile: boolean;
	isAuthenticated: boolean;
	error: string | null;
	fetchUser: (signal?: AbortSignal | undefined) => Promise<User | string>;
}

export function useAuth(): UseAuthInterface {
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/* ---------------- fetch user ---------------- */

	const fetchUser = useCallback(async (signal?: AbortSignal) => {
		setAuthLoading(true);
		setError(null);

		try {
			const { data } = await api.get<User>("/users/profile/", { signal });
			setUser(data);
			setIsAuthenticated(true);
			return data;
		} catch (err: unknown) {
			if (signal?.aborted) return "Aborted";
			const error = getErrorMessage(err);

			if (isAxiosError(err) && err.response?.status === 401) {
				// Unauthorized → log out
				setUser(null);
				setIsAuthenticated(false);
				return "Unauthorized";
			}
			// Keep user unknown, show notification
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Error",
				description: error,
			});

			setError(error);

			return error;
		} finally {
			setAuthLoading(false);
		}
	}, []);

	useAbortableEffect(
		(signal) => {
			const init = async () => {
				await fetchUser(signal);
			};

			init();
		},
		[fetchUser],
	);

	// ------------------- LOGIN -------------------
	const { mutate: login, isMutating: loggingIn } = useMutation<
		Tokens,
		{ phone_number: string; password: string },
		ParsedErrors<LoginFields>
	>(
		async ({ phone_number, password }) => {
			const { data } = await api.post<Tokens>("/auth/login/", {
				phone_number,
				password,
			});

			return data;
		},
		{
			onSuccess: async (data) => {
				await setTokens(data.access, data.refresh);
				queueMicrotask(() => fetchUser());
				queueMicrotask(() => setIsAuthenticated(true));
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "Logged in successfully",
				});
			},
			onError: (err) => {
				if (isAxiosError(err)) {
					return parseErrors<LoginFields>(err.response?.data || {}, [
						"phone_number",
						"password",
					]);
				}
				if (err instanceof Error) return { form: err.message, fields: {} };
				return { form: "Login failed", fields: {} };
			},
		},
	);

	// ------------------- REGISTER -------------------
	const { mutate: register, isMutating: registering } = useMutation<
		UserWithTokens,
		{ name: string; phone_number: string; password: string },
		ParsedErrors<RegisterFields>
	>(
		async ({ name, phone_number, password }) => {
			const { data } = await api.post<UserWithTokens>("/users/register/", {
				name,
				phone_number,
				password,
			});

			return data;
		},
		{
			onSuccess: async (data) => {
				await setTokens(data.access, data.refresh);
				queueMicrotask(() => fetchUser());
				queueMicrotask(() => setIsAuthenticated(true));

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "Account created successfully",
				});
			},
			onError: (err) => {
				if (isAxiosError(err)) {
					return parseErrors<RegisterFields>(err.response?.data || {}, [
						"name",
						"phone_number",
						"password",
					]);
				}
				if (err instanceof Error) return { form: err.message, fields: {} };
				return { form: "Register failed", fields: {} };
			},
		},
	);

	// ------------------- CHANGE PASSWORD -------------------
	const { mutate: changePassword, isMutating: changingPassword } = useMutation<
		void,
		{
			current_password: string;
			new_password: string;
			confirm_password: string;
		},
		ParsedErrors<ChangePasswordFields>
	>(
		async (form) => {
			await api.post("/users/change-password/", form);
		},
		{
			onSuccess: async () => {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "Password changed successfully",
				});
			},
			onError: (err) => {
				if (isAxiosError(err)) {
					return parseErrors<ChangePasswordFields>(err.response?.data || {}, [
						"current_password",
						"new_password",
						"confirm_password",
					]);
				}
				if (err instanceof Error) return { form: err.message, fields: {} };
				return { form: "Something went wrong", fields: {} };
			},
		},
	);

	// ------------------- EDIT PROFILE -------------------
	const { mutate: editUserDetails, isMutating: updatingProfile } = useMutation<
		User,
		{ name: string; phone_number: string },
		ParsedErrors<EditUserFields>
	>(
		async (form) => {
			const { data } = await api.patch<User>("/users/profile/", form);
			return data;
		},
		{
			onSuccess: (data) => {
				setUser(data);
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "Profile updated successfully",
				});
			},
			onError: (err) => {
				if (isAxiosError(err)) {
					return parseErrors<EditUserFields>(err.response?.data || {}, [
						"name",
						"phone_number",
					]);
				}
				if (err instanceof Error) return { form: err.message, fields: {} };
				return { form: "Update failed", fields: {} };
			},
		},
	);

	// ------------------- LOGOUT -------------------
	const logout = useCallback(async () => {
		clearAuthQueue(); // stop pending requests
		try {
			const refresh = await SecureStore.getItemAsync("refreshToken");
			if (refresh) {
				const res = await api.post("/auth/logout/", { refresh });

				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Logout Success",
					description: res.data.message || "Logged out successfully!",
				});
			}
		} catch (err: unknown) {
			let message = "Server logout failed.";
			if (isAxiosError(err)) message = getErrorMessage(err);
			if (err instanceof Error) message = err.message;

			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Logout Warning",
				description: message,
			});
		} finally {
			clearAllCache(); // clear all cached API data

			setUser(null);
			setIsAuthenticated(false);

			await clearTokens();

			router.replace("/login");
		}
	}, [setUser]);

	return {
		user,
		authLoading,
		login,
		register,
		logout,
		changePassword,
		editUserDetails,
		isAuthenticated,
		error,
		loggingIn,
		registering,
		changingPassword,
		updatingProfile,

		fetchUser,
	};
}
