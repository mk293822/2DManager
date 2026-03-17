import { BussinessUserDetailsContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useBussinessUserDetailsContext() {
	const context = useContext(BussinessUserDetailsContext);
	if (!context)
		throw new Error(
			"useBussinessUserDetailsContext must be used inside BussinessUserDetailsProvider",
		);
	return context;
}
