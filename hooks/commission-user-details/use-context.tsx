import { CommissionUserDetailsContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useCommissionUserDetailsContext() {
	const context = useContext(CommissionUserDetailsContext);
	if (!context)
		throw new Error(
			"useCommissionUserDetailsContext must be used inside CommissionUserDetailsProvider",
		);
	return context;
}
