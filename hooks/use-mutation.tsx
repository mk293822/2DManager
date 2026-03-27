import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import { useState } from "react";
import { useInternet } from "./use-internet";

export type MutationOptions<TData, TVariables, TError> = {
	onSuccess?: (data: TData, variables: TVariables) => void;
	onError?: (error: unknown) => TError;
};

export type MutationResult<TData, TError> = {
	data?: TData;
	error?: TError;
};

export const useMutation = <TData, TVariables = void, TError = unknown>(
	mutationFn: (variables: TVariables) => Promise<TData>,
	options?: MutationOptions<TData, TVariables, TError>,
) => {
	const [isMutating, setIsMutating] = useState(false);
	const isConnected = useInternet();

	const mutate = async (
		variables: TVariables,
	): Promise<MutationResult<TData, TError>> => {
		setIsMutating(true);

		try {
			if (!isConnected) {
				eventBus.emit(EVENT_NAMES.OFFLINE_ACTION, {
					message: "You are Offline!.",
					retry: () => mutate(variables),
				});
				return { error: new Error("Offline") as TError };
			}

			const result = await mutationFn(variables);

			options?.onSuccess?.(result, variables);

			return { data: result };
		} catch (e: unknown) {
			if (options?.onError) {
				return { error: options.onError(e) };
			}

			if (e instanceof Error) {
				return { error: e as TError };
			}

			return { error: new Error("Something went wrong") as TError };
		} finally {
			setIsMutating(false);
		}
	};

	return { mutate, isMutating };
};
