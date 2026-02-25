import { CommissoinUserHeaderContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useCommissionUserPageHeaderContext() {
	const context = useContext(CommissoinUserHeaderContext);
	if (!context)
		throw new Error(
			"useCommissionUserPageHeaderContext must be used inside CommissoinUserPageHeaderContextProvider",
		);
	return context;
}
