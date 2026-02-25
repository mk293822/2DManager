import { ToggleContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useManagePageHeaderContext() {
	const context = useContext(ToggleContext);
	if (!context)
		throw new Error(
			"useManagePageHeaderContext must be used inside ManagePageHeaderContextProvider",
		);
	return context;
}
