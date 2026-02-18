import { ManagePageDataContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useManagePageDataContext() {
	const context = useContext(ManagePageDataContext);
	if (!context)
		throw new Error(
			"useManagePageDataContext must be used inside ManagePageDataContextProvider",
		);
	return context;
}
