import { CommissoinUserPageContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useCommissionUserPageContext() {
	const context = useContext(CommissoinUserPageContext);
	if (!context)
		throw new Error(
			"useCommissionUserPageContext must be used inside CommissoinUserPageContextProvider",
		);
	return context;
}
