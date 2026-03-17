import useBussinessUserDetailsHook from "@/hooks/bussiness-user-details/use-user-details-hook";
import { BussinessUserType } from "@/types/bussiness-user-types";
import React, { useMemo, useState } from "react";
import { BussinessUserDetailsContext } from "./contexts";

const BussinessUserDetailsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	// Track current type of business user
	const [bussinessUserType, setBussinessUserType] =
		useState<BussinessUserType>("commission_user");

	// Hook manages fetching, creation, deletion, caching per type
	const data = useBussinessUserDetailsHook(bussinessUserType);

	// Memoize context value to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({ ...data, bussinessUserType, setBussinessUserType }),
		[data, bussinessUserType],
	);

	return (
		<BussinessUserDetailsContext.Provider value={contextValue}>
			{children}
		</BussinessUserDetailsContext.Provider>
	);
};

export default BussinessUserDetailsProvider;
