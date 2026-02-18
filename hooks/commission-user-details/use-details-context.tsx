import { CommissionUserDetailsContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useCommissionUserDetailsContext() {
	const context = useContext(CommissionUserDetailsContext);
	if (!context)
		throw new Error(
			"useDetailsContext must be used inside CommissionUserDetailsContextProvider",
		);
	return context;
}
