import { api } from "@/lib/api";
import { TwoDListType } from "@/types/two-d-list-types";
import { useState } from "react";

export type TwoDListHookType = {
	loading: boolean;
	error: string | null;
	twoDList: TwoDListType[] | null;
	fetchTwoDList: (
		signal: AbortSignal,
		section_sale_id: string,
	) => Promise<void>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	handleCreateTwoDList: (
		section_sale_id: string,
		number: string,
		total_amount: number,
	) => Promise<void>;
};

const useTwoDListHook = (): TwoDListHookType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [twoDList, setTwoDList] = useState<TwoDListType[] | null>(null);

	const fetchTwoDList = async (
		signal: AbortSignal,
		section_summary_id: string,
	) => {
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get<TwoDListType[]>(
				`/sold-numbers/section-summary/${section_summary_id}/`,
				{
					signal,
				},
			);

			if (!signal.aborted) {
				setTwoDList(data);
			}
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") {
				// Request was cancelled → do nothing
				return;
			}

			setError("Failed to load two d list. Please try again.");
			setTwoDList(null);
		} finally {
			if (!signal.aborted) {
				setLoading(false);
			}
		}
	};

	const handleCreateTwoDList = async (
		section_sale_id: string,
		number: string,
		total_amount: number,
	) => {
		try {
			const { data } = await api.post<TwoDListType>(
				`/sold-numbers/${section_sale_id}/`,
				{
					number: number,
					total_amount: total_amount,
				},
			);
			if (data.section_summary === twoDList?.[0]?.section_summary)
				setTwoDList((prev) => {
					if (!prev) return [data];

					const index = prev.findIndex((item) => item.id === data.id);

					if (index >= 0) {
						const newList = [...prev];
						newList[index] = data;
						return newList;
					}

					return [...prev, data];
				});
		} catch {
			setError("Failed to create two d list");
		}
	};

	return {
		loading,
		error,
		twoDList,
		setError,
		fetchTwoDList,
		handleCreateTwoDList,
	};
};

export default useTwoDListHook;
