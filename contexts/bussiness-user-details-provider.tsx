import useBussinessUserHook from "@/hooks/bussiness-users/use-bussiness-user-hook";
import { BussinessUserType } from "@/types/bussiness-user-types";
import React, { useMemo, useState } from "react";
import { BussinessUserContext } from "./contexts";

const BussinessUserProvider = ({ children }: { children: React.ReactNode }) => {
	// Track current type of business user
	const [bussinessUserType, setBussinessUserType] =
		useState<BussinessUserType>("commission_user");

	// Hook manages fetching, creation, deletion, caching per type
	const data = useBussinessUserHook(bussinessUserType);

	// Memoize context to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({ ...data, bussinessUserType, setBussinessUserType }),
		[data, bussinessUserType],
	);

	return (
		<BussinessUserContext.Provider value={contextValue}>
			{children}
		</BussinessUserContext.Provider>
	);
};

export default BussinessUserProvider;
