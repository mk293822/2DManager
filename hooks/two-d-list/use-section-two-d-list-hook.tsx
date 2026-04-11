import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import { createKey } from "@/lib/cache-helper";
import { eventBus } from "@/lib/event-bus";
import { SectionName } from "@/types/manage-types";
import { NumberItem, NumberType, TwoDListType } from "@/types/two-d-list-types";
import { isAxiosError } from "axios";
import { useCache } from "../use-cache";
import { MutationResult, useMutation } from "../use-mutation";

export type TwoDListHookType = {
	loading: boolean;
	creatingTwoDList: boolean;
	error: Error | null;
	twoDList: TwoDListType[] | null;

	createTwoDList: (variables: {
		numbers_data: NumberItem[];
		section: SectionName;
	}) => Promise<MutationResult<TwoDListType, string>>;
	refetch: () => Promise<void>;
	deleteTwoDList: (variables: string) => Promise<MutationResult<void, string>>;
	deletingTwoDList: boolean;
};

const MODEL = "sectionTwoDList" as const;

const useSectionTwoDListHook = (
	numberType: NumberType,
	sectionSaleId: string,
): TwoDListHookType => {
	const endpoint =
		numberType === "sold_number"
			? `/sold-numbers/${sectionSaleId}/`
			: `/resold-numbers/${sectionSaleId}/`;

	const key = createKey(MODEL, {
		type: numberType,
		id: sectionSaleId,
	});

	const {
		data: twoDList,
		setData,
		refetch,
		isLoading: loading,
		error,
	} = useCache<TwoDListType[]>(key, async () => {
		const { data } = await api.get<TwoDListType[]>(endpoint);
		return data;
	});

	const { mutate: createTwoDList, isMutating: creatingTwoDList } = useMutation<
		TwoDListType,
		{ numbers_data: NumberItem[]; section: SectionName },
		string
	>(
		async (payload: { numbers_data: NumberItem[]; section: SectionName }) => {
			const { data } = await api.post<TwoDListType>(endpoint, {
				numbers_data: payload.numbers_data,
			});
			return data;
		},
		{
			onSuccess: (data) => {
				setData((prev) => (prev ? [...prev, data] : [data]));
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "success",
					title: "Success",
					description: "TwoD List created successfully",
				});
				eventBus.emit(EVENT_NAMES.ONLINE_ACTION, {
					action: "create",
					model: MODEL,
					id: sectionSaleId,
				});
			},
			onError: (err) => {
				let message = "TwoD List create failed.";

				// Normalize error
				if (isAxiosError(err)) {
					message = err.response?.data?.detail || message;
				} else if (err instanceof Error) {
					message = err.message;
				}

				return message;
			},
		},
	);

	const { mutate: deleteTwoDList, isMutating: deletingTwoDList } = useMutation<
		void,
		string,
		string
	>(async (id) => await api.delete(`${endpoint}${id}/`), {
		onSuccess: (_, id) => {
			setData((prev) => (prev ? prev.filter((item) => item.id !== id) : []));
			eventBus.emit(EVENT_NAMES.ONLINE_ACTION, {
				action: "delete",
				model: MODEL,
				id: id,
			});
		},
		onError: (err) => {
			let message = "Delete failed.";

			if (isAxiosError(err)) {
				message = err.response?.data?.detail || message;
			} else if (err instanceof Error) {
				message = err.message;
			}

			return message;
		},
	});

	return {
		loading,
		error,
		twoDList,
		createTwoDList,
		refetch,
		creatingTwoDList,
		deleteTwoDList,
		deletingTwoDList,
	};
};

export default useSectionTwoDListHook;
