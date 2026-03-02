import { TwoDListContext } from "@/contexts/contexts";
import { useContext } from "react";

export function useTwoDListsContext() {
	const context = useContext(TwoDListContext);
	if (!context)
		throw new Error(
			"useTwoDListsContext must be used inside TwoDListContextProvider",
		);
	return context;
}
