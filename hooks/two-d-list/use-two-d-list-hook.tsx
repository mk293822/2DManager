import { api } from "@/lib/api";
import { SectionName } from "@/types/manage-types";
import { TwoDListGroup, TwoDListType } from "@/types/two-d-list-types";
import { useState } from "react";

export type TwoDListHookType = {
	loading: boolean;
	error: string | null;
	twoDListGroup: TwoDListGroup | null;
	twoDList: TwoDListType[] | null;
	fetchTwoDList: (
		signal: AbortSignal,
		section_sale_id: string | undefined,
	) => Promise<void>;
	fetchTwoDListBySectionSale: (
		signal: AbortSignal,
		section_sale: string | undefined,
	) => Promise<void>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;

	handleCreateTwoDList: (
		section_sale_id: string,
		numbers_data: {
			total_amount: number;
			number: string;
		}[],
		section_summary: string,
		commission_user: string,
		section: SectionName,
	) => Promise<void>;
};

const useTwoDListHook = (): TwoDListHookType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [twoDListGroup, setTwoDListGroup] = useState<TwoDListGroup | null>(
		null,
	);

	const [twoDList, setTwoDList] = useState<TwoDListType[] | null>(null);

	const fetchTwoDList = async (
		signal: AbortSignal,
		section_summary_id: string | undefined,
	) => {
		if (!section_summary_id) {
			setTwoDListGroup(null);
			return;
		}
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get<TwoDListGroup>(
				`/sold-numbers/section-summary/${section_summary_id}/`,
				{
					signal,
				},
			);

			if (!signal.aborted) {
				setTwoDListGroup(data);
			}
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") {
				// Request was cancelled → do nothing
				return;
			}

			setError("Failed to load two d list. Please try again.");
			setTwoDListGroup(null);
		} finally {
			if (!signal.aborted) {
				setLoading(false);
			}
		}
	};

	const fetchTwoDListBySectionSale = async (
		signal: AbortSignal,
		section_sale: string | undefined,
	) => {
		if (!section_sale) {
			setTwoDList(null);
			return;
		}
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get<TwoDListType[]>(
				`/sold-numbers/${section_sale}/`,
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
		numbers_data: {
			total_amount: number;
			number: string;
		}[],
		section_summary: string,
		commission_user: string,
		section: SectionName,
	) => {
		try {
			const { data } = await api.post<TwoDListType>(
				`/sold-numbers/${section_sale_id}/`,
				{ numbers_data },
			);
			setTwoDListGroup((prev) => {
				if (!prev) {
					return {
						section_summary,
						section,
						sold_numbers_by_user: {
							[commission_user]: [data],
						},
					};
				}

				return {
					...prev,
					sold_numbers_by_user: {
						...prev.sold_numbers_by_user,
						[commission_user]: prev.sold_numbers_by_user[commission_user]
							? [...prev.sold_numbers_by_user[commission_user], data]
							: [data],
					},
				};
			});
		} catch {
			setError("Failed to create two d list");
		}
	};

	return {
		loading,
		error,
		twoDList,
		twoDListGroup,
		setError,
		fetchTwoDList,
		handleCreateTwoDList,
		fetchTwoDListBySectionSale,
	};
};

export default useTwoDListHook;
