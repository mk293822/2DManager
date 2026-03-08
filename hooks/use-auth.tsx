import { api, clearTokens, setTokens } from "@/lib/api";
import { User } from "@/types/main";
import { AxiosError, isCancel } from "axios";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import * as SecureStore from "expo-secure-store";

export interface UseAuthInterface {
	user: User | null;
	authLoading: boolean;
	isAuthenticated: boolean;
	login: (phone_number: string, password: string) => void;
	register: (name: string, phone_number: string, password: string) => void;
	logout: () => void;
	fetchUser: () => void;
	changePassword: (form: {
		current_password: string;
		new_password: string;
		confirm_password: string;
	}) => Promise<any>;
	editUserDetails: (form: {
		name: string;
		phone_number: string;
	}) => Promise<void>;
	errors: {
		current_password?: string | undefined;
		new_password?: string | undefined;
		confirm_password?: string | undefined;
	};
}

export function useAuth(): UseAuthInterface {
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [errors, setErrors] = useState<{
		current_password?: string;
		new_password?: string;
		confirm_password?: string;
	}>({});

	const fetchUser = useCallback(async () => {
		setAuthLoading(true);
		try {
			const { data } = await api.get<User>("/users/profile/");
			setUser(data);
			return data;
		} catch {
			setUser(null);
			return null;
		} finally {
			setAuthLoading(false);
		}
	}, []);

	const login = useCallback(
		async (phone_number: string, password: string) => {
			const { data } = await api.post("/auth/login/", {
				phone_number,
				password,
			});
			await setTokens(data.access, data.refresh);
			// fetch user AFTER login
			return fetchUser();
		},
		[fetchUser],
	);

	const register = useCallback(
		async (name: string, phone_number: string, password: string) => {
			const { data } = await api.post("/users/register/", {
				name,
				phone_number,
				password,
			});
			await setTokens(data.access, data.refresh);
			const user = data.user;
			if (user) {
				setUser(user);
			} else return fetchUser();
		},
		[fetchUser],
	);

	const logout = useCallback(async () => {
		try {
			const refresh = await SecureStore.getItemAsync("refreshToken");
			if (refresh) {
				await api.post("/auth/logout/", { refresh }); // blacklist refresh token
			}
		} catch (err) {
			if (isCancel(err)) return;
			if (err instanceof AxiosError) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					title: err.response?.data?.message || err.message || "Logout failed",
					description:
						"There was a problem logging out your account. Please try again.",
					type: "error",
				});
			} else {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					title: "Logout failed ",
					description:
						"There was a problem logging out your account. Please try again.",
					type: "error",
				});
			}
		} finally {
			setUser(null); // immediate UI logout
			await clearTokens(); // remove tokens locally
			router.replace("/login"); // redirect safely
		}
	}, []);

	const changePassword = async (form: {
		current_password: string;
		new_password: string;
		confirm_password: string;
	}) => {
		setErrors({});
		try {
			await api.post("/users/change-password/", { ...form });
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				description: "Password changed successfully!",
				title: "Success",
			});
		} catch (err: any) {
			const errData = err.response?.data || {};
			const fieldErrors: typeof errors = {};

			if (errData.current_password)
				fieldErrors.current_password = errData.current_password.join(" ");
			if (errData.new_password)
				fieldErrors.new_password = errData.new_password.join(" ");
			if (errData.confirm_password)
				fieldErrors.confirm_password = errData.confirm_password.join(" ");

			// Non-field errors
			if (errData.non_field_errors)
				fieldErrors.confirm_password = errData.non_field_errors.join(" ");

			setErrors(fieldErrors);
		}
	};

	const editUserDetails = async (form: {
		name: string;
		phone_number: string;
	}) => {
		const { data } = await api.patch<User>("/users/profile/", {
			...form,
		});

		setUser(data);
	};

	// On mount: refresh user (if already logged in)
	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	const isAuthenticated = !!user;

	return {
		user,
		authLoading,
		isAuthenticated,
		login,
		register,
		logout,
		fetchUser,
		changePassword,
		editUserDetails,
		errors,
	};
}
