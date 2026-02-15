import useCommissionUserHook from "@/hooks/use-commission-user-hook";
import React from "react";
import { CommissoinUserDataContext } from "./contexts";

const CommissionUserDataContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const value = useCommissionUserHook();

	return (
		<CommissoinUserDataContext.Provider value={value}>
			{children}
		</CommissoinUserDataContext.Provider>
	);
};

export default CommissionUserDataContextProvider;
