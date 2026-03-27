import { api } from "@/lib/api";
import { createKey } from "@/lib/cache-helper";
import { NumberType, TwoDListGroup } from "@/types/two-d-list-types";
import { useCache } from "../use-cache";

export type TwoDListHookType = {
	loading: boolean;
	error: Error | null;
	twoDListGroup: TwoDListGroup | null;
	refetch: () => Promise<void>;
};

const useTwoDListHook = (
	numberType: NumberType,
	sectionSummaryId: string,
): TwoDListHookType => {
	const endpoint =
		numberType === "sold_number" ? "/sold-numbers/" : "/resold-numbers/";
	const key = createKey("twoDList", {
		type: numberType,
	});
	const {
		data: twoDListGroup,
		refetch,
		isLoading: loading,
		error,
	} = useCache<TwoDListGroup>(key, async () => {
		const { data } = await api.get<TwoDListGroup>(
			`${endpoint}section-summary/${sectionSummaryId}/`,
		);
		return data;
	});

	return {
		loading,
		error,
		twoDListGroup,
		refetch,
	};
};

export default useTwoDListHook;
