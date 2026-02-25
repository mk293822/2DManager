import { api } from "@/lib/api";
import { formatDateRequest } from "@/lib/helpers";
import { SectionSaleGroup } from "@/types/commission-user-types";
import { SectionRange } from "@/types/manage-types";
import { useState } from "react";

export type SectionSalesHookTypes = {
	loading: boolean;
	error: string | null;
	// reset: (id: string | undefined) => void;
	// createComUserSection: (
	// 	id: string,
	// 	section: SectionName,
	// 	date?: Date,
	// ) => Promise<void>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;

	fetchSectionSales: (
		signal: AbortSignal,
		id: string,
		sectionRange: SectionRange,
	) => Promise<void>;
	sectionSales: SectionSaleGroup[] | null;
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
	) => {
		try {
			setLoading(true);
			setError(null);

			const { data } = await api.get(`/commission-users/${id}/section-sales/`, {
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
	};
};

export default useSectionSalesHook;
