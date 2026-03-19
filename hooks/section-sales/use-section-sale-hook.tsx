import { api } from "@/lib/api";
import { formatDateRequest } from "@/lib/helpers";
import {
	BussinessUserType,
	SectionSaleGroup,
} from "@/types/bussiness-user-types";
import { SectionRange } from "@/types/manage-types";
import { useState } from "react";

export type SectionSalesHookTypes = {
	loading: boolean;
	error: string | null;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	fetchSectionSales: (
		signal: AbortSignal,
		id: string,
		sectionRange: SectionRange,
		bussinessUserType: BussinessUserType,
		showLoading?: boolean,
	) => Promise<void>;
	sectionSales: SectionSaleGroup[] | null;
	setSectionSales: React.Dispatch<
		React.SetStateAction<SectionSaleGroup[] | null>
	>;
};
const useSectionSalesHook = (): SectionSalesHookTypes => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sectionSales, setSectionSales] = useState<SectionSaleGroup[] | null>(
		null,
	);

	const fetchSectionSales = async (
		signal: AbortSignal,
		id: string,
		sectionRange: SectionRange,
		bussinessUserType: BussinessUserType,
		showLoading: boolean = true,
	) => {
		try {
			if (showLoading) setLoading(true);
			setError(null);

			const endpoint =
				bussinessUserType === "commission_user"
					? "commission-users"
					: "resold-users";

			const { data } = await api.get(`/${endpoint}/${id}/section-sales/`, {
				signal,
				params:
					sectionRange.type === "day"
						? { type: "day", date: formatDateRequest(sectionRange.date) }
						: { ...sectionRange, month: sectionRange.month + 1 },
			});

			if (!signal.aborted) {
				const sectionsArray: SectionSaleGroup[] =
					sectionRange.type === "day" ? [data] : data;
				setSectionSales(sectionsArray);
			}
		} catch (err: any) {
			if (err.name === "CanceledError" || err.name === "AbortError") {
				// Request was cancelled → do nothing
				return;
			}

			setError("Failed to load section sales. Please try again.");
			setSectionSales(null);
		} finally {
			if (!signal.aborted) {
				setLoading(false);
			}
		}
	};

	return {
		loading,
		error,
		sectionSales,
		fetchSectionSales,
		setError,
		setSectionSales,
	};
};

export default useSectionSalesHook;
