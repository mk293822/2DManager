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
}

export function useAuth(): UseAuthInterface {
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);

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
			router.replace("/(auth)/login"); // redirect safely
		}
	}, []);

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
	};
}
