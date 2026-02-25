import { ToggleContext } from "@/contexts/contexts";
import { RangeMode } from "@/types/manage-types";
import React from "react";

const SectionSalesHeaderContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [rangeMode, setRangeMode] = React.useState<RangeMode>("day");

	return (
		<ToggleContext.Provider value={{ rangeMode, setRangeMode }}>
			{children}
		</ToggleContext.Provider>
	);
};

export default SectionSalesHeaderContextProvider;
