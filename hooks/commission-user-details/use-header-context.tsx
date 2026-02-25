import { CommissoinUserDetailsHeaderContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useCommissionUserDetailsPageHeaderContext() {
	const context = useContext(CommissoinUserDetailsHeaderContext);
	if (!context)
		throw new Error(
			"useCommissionUserDetailsPageHeaderContext must be used inside CommissionUserDetailsPageHeaderContextProvider",
		);
	return context;
}
