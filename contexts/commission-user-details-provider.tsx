import { CommissionUserDetailsContext } from "@/contexts/contexts";
import useCommissionUserDetailsHook from "@/hooks/commission-user-details/use-commission-user-details-hook";
import React from "react";

const CommissionUserDetailsProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const data = useCommissionUserDetailsHook();
	return (
		<CommissionUserDetailsContext.Provider value={data}>
			{children}
		</CommissionUserDetailsContext.Provider>
	);
};

export default CommissionUserDetailsProvider;
