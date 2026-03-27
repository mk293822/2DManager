// hooks/useBussinessUserDetailsHook.ts
import { EVENT_NAMES } from "@/event-names";
import { api } from "@/lib/api";
import { createKey } from "@/lib/cache-helper";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors, parseErrors } from "@/lib/helpers";
import { BussinessUser, BussinessUserType } from "@/types/bussiness-user-types";
import { isAxiosError } from "axios";
import { useCache } from "../use-cache";
import { MutationResult, useMutation } from "../use-mutation";

export type BussinessUserEditFields =
	| "name"
	| "phone_number"
	| "default_commission_percent"
	| "default_draw_times_percent"
	| "manager_name"
	| "default_draw_times";

export type BussinessUserDetailsHookType = {
	bussinessUserDetailsLoading: boolean;
	bussinessDetailsError: Error | null;
	bussinessUserDetails: BussinessUser | null;
	refetchBussinessUserDetails: () => Promise<void>;
	editBussinessUserDetails: (
		variables: Partial<BussinessUser>,
	) => Promise<
		MutationResult<BussinessUser, ParsedErrors<BussinessUserEditFields>>
	>;
	editingUser: boolean;
};

const MODEL = "bussinessUser";

const useBussinessUserDetailsHook = (
	id: string,
	bussinessUserType: BussinessUserType,
): BussinessUserDetailsHookType => {
	// -------------------
	// CACHES
	// -------------------
	const cacheKey = createKey(MODEL, {
		id,
		userType: bussinessUserType,
	});

	const {
		data: bussinessUserDetails,
		setData: setBussinessUserDetails,
		refetch: refetchBussinessUserDetails,
		isLoading: bussinessUserDetailsLoading,
		error: bussinessDetailsError,
	} = useCache<BussinessUser>(cacheKey, async () => {
		const endpoint =
			bussinessUserType === "commission_user"
				? `/commission-users/${id}/`
				: `/resold-users/${id}/`;
		const { data } = await api.get<BussinessUser>(endpoint);
		return data;
	});

	// -------------------
	// MUTATIONS
	// -------------------
	const { mutate: editBussinessUserDetails, isMutating: editingUser } =
		useMutation<
			BussinessUser,
			Partial<BussinessUser>,
			ParsedErrors<BussinessUserEditFields>
		>(
			async (form: Partial<BussinessUser>) => {
				if (!bussinessUserDetails) throw new Error("No user loaded");
				const endpoint =
					bussinessUserType === "commission_user"
						? `/commission-users/${bussinessUserDetails.id}/`
						: `/resold-users/${bussinessUserDetails.id}/`;
				const { data } = await api.put<BussinessUser>(endpoint, form);
				return data;
			},
			{
				onSuccess: (data) => {
					setBussinessUserDetails(data);
					eventBus.emit(EVENT_NAMES.NOTIFICATION, {
						type: "success",
						title: "Success",
						description: "User details updated",
					});
				},
				onError: (err) => {
					if (isAxiosError(err)) {
						const errors = parseErrors<BussinessUserEditFields>(
							err?.response?.data || {},
							[
								"name",
								"phone_number",
								"default_commission_percent",
								"default_draw_times_percent",
								"manager_name",
							],
						);
						return errors;
					}
					if (err instanceof Error) {
						// Regular JS Error
						return { form: err.message, fields: {} };
					}

					// Unknown / unexpected error
					return { form: "Something went wrong", fields: {} };
				},
			},
		);

	return {
		bussinessUserDetails,
		editBussinessUserDetails,
		editingUser,
		bussinessUserDetailsLoading,
		bussinessDetailsError,
		refetchBussinessUserDetails,
	};
};

export default useBussinessUserDetailsHook;
