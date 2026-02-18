import { CommissionUserDetailsContext } from "@/contexts/contexts";
import useCommissionUserDetailsHook from "@/hooks/commission-user-details/use-commission-user-details-hook";
import React from "react";

const CommissionUserDetailsPageProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const data = useCommissionUserDetailsHook();

	return (
		<CommissionUserDetailsContext.Provider value={data}>
			{children}
		</CommissionUserDetailsContext.Provider>
	);
};

export default CommissionUserDetailsPageProvider;
