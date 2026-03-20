import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import { eventBus } from "@/lib/event-bus";
import {
	formatDateRequest,
	ParsedErrors,
	parseErrors,
	upsertByDate,
} from "@/lib/helpers";
import {
	BussinessUserType,
	SectionSale,
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
	editBussinessUserSection: (
		id: string,
		userId: string,
		form: Partial<SectionSale>,
		bussinessUserType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserSectionEditFields>;
	}>;
};

export type BussinessUserSectionEditFields =
	| "commission_percent"
	| "total_amount"
	| "total_draw_value";

const useSectionSalesHook = (): SectionSalesHookTypes => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sectionSales, setSectionSales] = useState<SectionSaleGroup[] | null>(
		null,
	);

	/**
	 * Edit section for the bussiness user
	 */
	const editBussinessUserSection = async (
		id: string,
		userId: string,
		form: Partial<SectionSale>,
		bussinessUserType: BussinessUserType,
	) => {
		try {
			setError(null);

			const endpoint =
				bussinessUserType === "commission_user"
					? `/commission-users/${userId}/section-sales/${id}/`
					: `/resold-users/${userId}/section-sales/${id}/`;

			const { data } = await api.put<SectionSaleGroup>(endpoint, form);

			setSectionSales((prev) => upsertByDate<SectionSaleGroup>(prev, data));
			// Notify success
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "success",
				title: "Success",
				description: `Section edited successfully`,
			});

			return { success: true, errors: { fields: {} } };
		} catch (err: any) {
			const data = err?.response?.data || {};
			const errors = parseErrors<BussinessUserSectionEditFields>(data, [
				"total_amount",
				"commission_percent",
				"total_draw_value",
			]);
			return { success: false, errors };
		}
	};

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
		editBussinessUserSection,
	};
};

export default useSectionSalesHook;
