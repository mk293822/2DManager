import { ManagePageToggleContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useManagePageToggleContext() {
	const context = useContext(ManagePageToggleContext);
	if (!context)
		throw new Error(
			"useManagePageToggleContext must be used inside ManagePageToggleContextProvider",
		);
	return context;
}
