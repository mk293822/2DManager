import axios from "axios";
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

// Response interceptor: handle 401 automatically
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url?.endsWith("/auth/refresh/")
		) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						if (originalRequest.headers)
							originalRequest.headers.Authorization = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = await SecureStore.getItemAsync("refreshToken");
				if (!refreshToken) throw new Error("No refresh token");

				const { data } = await api.post("/auth/refresh/", {
					refresh: refreshToken,
				});

				await setTokens(data.access, data.refresh);
				processQueue(null, data.access);

				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${data.access}`;
				}

				return api(originalRequest);
			} catch (err) {
				processQueue(err, null);
				await clearTokens();
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
