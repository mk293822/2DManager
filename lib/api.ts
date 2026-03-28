import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

export const two_d_api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_TOW_D_API_URL,
	timeout: 1000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

export const three_d_api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_THREE_D_API_URL,
	timeout: 1000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;

export const api = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// Attach access token automatically
api.interceptors.request.use(async (config) => {
	const token = await SecureStore.getItemAsync("accessToken");
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Helper to store tokens
export const setTokens = async (access: string, refresh: string) => {
	await SecureStore.setItemAsync("accessToken", access);
	await SecureStore.setItemAsync("refreshToken", refresh);
};

export const clearTokens = async () => {
	await SecureStore.deleteItemAsync("accessToken");
	await SecureStore.deleteItemAsync("refreshToken");
};

/* ---------------- TYPES ---------------- */

type QueueItem = {
	resolve: (token: string) => void;
	reject: (error: any) => void;
};

/* ---------------- STATE ---------------- */

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

/* ---------------- HELPERS ---------------- */

const processQueue = (error: any, token?: string) => {
	failedQueue.forEach((p) => {
		if (error) {
			p.reject(error);
		} else {
			p.resolve(token!);
		}
	});
	failedQueue = [];
};

export const clearAuthQueue = () => {
	failedQueue = [];
	isRefreshing = false;
};

/* ---------------- INTERCEPTOR ---------------- */

api.interceptors.response.use(
	(response) => response,

	async (error: AxiosError) => {
		const originalRequest = error.config as
			| (InternalAxiosRequestConfig & { _retry?: boolean })
			| undefined;

		// Safety check
		if (!originalRequest) {
			return Promise.reject(error);
		}

		/* ---------------- HANDLE 401 ---------------- */

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url?.endsWith("/auth/refresh/")
		) {
			/* ---------- If already refreshing ---------- */
			if (isRefreshing) {
				return new Promise<string>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						// retry original request with new token
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${token}`;
						}
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			/* ---------- Start refresh ---------- */
			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = await SecureStore.getItemAsync("refreshToken");

				/* ---------- No refresh token ---------- */
				if (!refreshToken) {
					const err = new Error("NO_REFRESH_TOKEN");

					processQueue(err);
					await clearTokens();

					return Promise.reject(error);
				}

				/* ---------- Refresh call ---------- */
				const { data } = await api.post<{
					access: string;
					refresh: string;
				}>("/auth/refresh/", {
					refresh: refreshToken,
				});

				/* ---------- Save tokens ---------- */
				await setTokens(data.access, data.refresh);

				/* ---------- Resolve queued requests ---------- */
				processQueue(null, data.access);

				/* ---------- Retry original request ---------- */
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${data.access}`;
				}

				return api(originalRequest);
			} catch (err) {
				/* ---------- Refresh failed ---------- */
				processQueue(err);
				await clearTokens();

				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
