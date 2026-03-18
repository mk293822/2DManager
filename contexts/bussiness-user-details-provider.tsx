import useBussinessUserDetailsHook from "@/hooks/bussiness-user-details/use-user-details-hook";
import React from "react";
import { BussinessUserDetailsContext } from "./contexts";

const BussinessUserDetailsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	// Track current type of business user
	const data = useBussinessUserDetailsHook();

	return (
		<BussinessUserDetailsContext.Provider value={data}>
			{children}
		</BussinessUserDetailsContext.Provider>
	);
};

export default BussinessUserDetailsProvider;
