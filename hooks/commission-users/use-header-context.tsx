import { CommissoinUserHeaderContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useCommissionUserHeaderContext() {
	const context = useContext(CommissoinUserHeaderContext);
	if (!context)
		throw new Error(
			"useCommissionUserHeaderContext must be used inside CommissoinUserHeaderContextProvider",
		);
	return context;
}
