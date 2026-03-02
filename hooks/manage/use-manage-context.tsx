import { ManageContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useManageContext() {
	const context = useContext(ManageContext);
	if (!context)
		throw new Error(
			"useManageContext must be used inside ManageContextProvider",
		);
	return context;
}
