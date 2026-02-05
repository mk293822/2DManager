import axios from "axios";

const BASE_URL = "https://api.thaistock2d.com";

export const api = axios.create({
	baseURL: BASE_URL,
	timeout: 1000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});
