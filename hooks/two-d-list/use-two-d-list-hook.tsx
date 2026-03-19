import { api } from "@/lib/api";
import { SectionName } from "@/types/manage-types";
import {
	NumberItem,
	NumberType,
	TwoDListGroup,
	TwoDListType,
} from "@/types/two-d-list-types";
import { useState } from "react";
import { useBussinessUserDetailsContext } from "../bussiness-user-details/use-context";
import { useManageContext } from "../manage/use-manage-context";

export type TwoDListHookType = {
	loading: boolean;
	error: string | null;
	twoDListGroup: TwoDListGroup | null;
	twoDList: TwoDListType[] | null;
	fetchTwoDList: (
		signal: AbortSignal,
		section_sale_id: string | undefined,
		showLoading?: boolean,
	) => Promise<void>;
	fetchTwoDListBySectionSale: (
		signal: AbortSignal,
		section_sale: string | undefined,
		showLoading?: boolean,
	) => Promise<void>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;

	handleCreateTwoDList: (
		section_sale_id: string,
		numbers_data: NumberItem[],
		section_summary: string,
		commission_user: string,
		section: SectionName,
		userId: string,
	) => Promise<void>;
};

const useTwoDListHook = (numberType: NumberType): TwoDListHookType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [twoDListGroup, setTwoDListGroup] = useState<TwoDListGroup | null>(
		null,
	);
	const { fetchBussinessUserDetails, bussinessUserType } =
		useBussinessUserDetailsContext();
	const { fetchSection } = useManageContext();

	const [twoDList, setTwoDList] = useState<TwoDListType[] | null>(null);

	const fetchTwoDList = async (
		signal: AbortSignal,
		section_summary_id: string | undefined,
		showLoading: boolean = false,
	) => {
		if (!section_summary_id) {
			setTwoDListGroup(null);
			return;
		}
		try {
			if (showLoading) setLoading(true);
			setError(null);

			const endpoint =
				numberType === "sold_number" ? "sold-numbers" : "resold-numbers";
			const { data } = await api.get<TwoDListGroup>(
				`/${endpoint}/section-summary/${section_summary_id}/`,
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
		showLoading: boolean = false,
	) => {
		if (!section_sale) {
			setTwoDList(null);
			return;
		}
		try {
			if (showLoading) setLoading(true);
			setError(null);

			const endpoint =
				numberType === "sold_number" ? "sold-numbers" : "resold-numbers";
			const { data } = await api.get<TwoDListType[]>(
				`/${endpoint}/${section_sale}/`,
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
		numbers_data: NumberItem[],
		section_summary: string,
		commission_user: string,
		section: SectionName,
		userId: string,
	) => {
		try {
			const endpoint =
				numberType === "sold_number" ? "sold-numbers" : "resold-numbers";
			const { data } = await api.post<TwoDListType>(
				`/${endpoint}/${section_sale_id}/`,
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
			const abortController = new AbortController();
			await fetchSection(
				abortController.signal,
				{
					type: "day",
					date: new Date(),
				},
				false,
			);
			await fetchBussinessUserDetails(abortController.signal, userId, false);
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
