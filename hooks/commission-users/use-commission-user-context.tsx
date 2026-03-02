import { CommissionUserContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useCommissionUserContext() {
	const context = useContext(CommissionUserContext);
	if (!context)
		throw new Error(
			"useCommissionUserContext must be used inside CommissionUserContextProvider",
		);
	return context;
}
