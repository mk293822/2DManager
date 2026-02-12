import { ManagePageContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useManagePageContext() {
	const context = useContext(ManagePageContext);
	if (!context)
		throw new Error(
			"useManageContext must be used inside ManagePageContextProvider",
		);
	return context;
}
