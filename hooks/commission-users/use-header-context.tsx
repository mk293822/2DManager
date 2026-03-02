import { CommissionUserHeaderContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useCommissionUserPageHeaderContext() {
	const context = useContext(CommissionUserHeaderContext);
	if (!context)
		throw new Error(
			"useCommissionUserPageHeaderContext must be used inside CommissionUserHeaderContextProvider",
		);
	return context;
}
