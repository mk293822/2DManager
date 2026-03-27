import OfflineActionModal from "@/components/ui/offline-action-modal";
import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import { AppEvents } from "@/types/event-bus";
import { useEffect, useState } from "react";

export default function OfflineActionHandler() {
	const [state, setState] = useState<{
		open: boolean;
		message: string;
		retry?: () => void;
	}>({ open: false, message: "" });

	useEffect(() => {
		const handler = (data: AppEvents["OFFLINE_ACTION"]) => {
			setState({
				open: true,
				message: data.message,
				retry: data.retry,
			});
		};

		eventBus.on(EVENT_NAMES.OFFLINE_ACTION, handler);

		return () => {
			eventBus.off(EVENT_NAMES.OFFLINE_ACTION, handler);
		};
	}, []);

	return (
		<OfflineActionModal
			open={state.open}
			message={state.message}
			onRetry={() => {
				setState((prev) => ({ ...prev, open: false }));
				state.retry?.();
			}}
			onClose={() => setState((prev) => ({ ...prev, open: false }))}
		/>
	);
}
