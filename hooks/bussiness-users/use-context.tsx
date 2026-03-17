import { BussinessUserContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useBussinessUserContext() {
	const context = useContext(BussinessUserContext);
	if (!context)
		throw new Error(
			"useBussinessUserContext must be used inside BussinessUserProvider",
		);
	return context;
}
