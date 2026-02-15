import { CommissoinUserDataContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useCommissionUserDataContext() {
	const context = useContext(CommissoinUserDataContext);
	if (!context)
		throw new Error(
			"useManageContext must be used inside ManagePageContextProvider",
		);
	return context;
}
