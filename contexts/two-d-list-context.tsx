import { TwoDListContext } from "@/contexts/contexts";
import useTwoDListHook from "@/hooks/two-d-list/use-two-d-list-hook";
import { NumberType } from "@/types/two-d-list-types";
import React, { useMemo, useState } from "react";

const TwoDListProvider = ({ children }: { children: React.ReactNode }) => {
	const [numberType, setNumberType] = useState<NumberType>("sold_number");
	const data = useTwoDListHook(numberType);

	const contextValue = useMemo(
		() => ({ ...data, numberType, setNumberType }),
		[data, numberType],
	);

	return (
		<TwoDListContext.Provider value={contextValue}>
			{children}
		</TwoDListContext.Provider>
	);
};

export default TwoDListProvider;
