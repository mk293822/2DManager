import { SectionContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useTwoDlistsPageHeaderContext() {
	const context = useContext(SectionContext);
	if (!context)
		throw new Error(
			"useTwoDlistsPageHeaderContext must be used inside TwoDListsPageHeaderContextProvider",
		);
	return context;
}
