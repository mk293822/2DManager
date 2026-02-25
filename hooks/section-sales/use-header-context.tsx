import { ToggleContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useSectionSalesPageHeaderContext() {
	const context = useContext(ToggleContext);
	if (!context)
		throw new Error(
			"useSectionSalesPageHeaderContext must be used inside SectionSalesPageHeaderContextProvider",
		);
	return context;
}
