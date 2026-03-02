import { TwoDListContext } from "@/contexts/contexts";
import useTwoDListHook from "@/hooks/two-d-list/use-two-d-list-hook";
import React from "react";

const TwoDListProvider = ({ children }: { children: React.ReactNode }) => {
	const data = useTwoDListHook();
	return (
		<TwoDListContext.Provider value={data}>{children}</TwoDListContext.Provider>
	);
};

export default TwoDListProvider;
