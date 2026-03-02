import { CommissionUserContext } from "@/contexts/contexts";
import useCommissionUserHook from "@/hooks/commission-users/use-commission-user-hook";
import React from "react";

const CommissionUserProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const data = useCommissionUserHook();
	return (
		<CommissionUserContext.Provider value={data}>
			{children}
		</CommissionUserContext.Provider>
	);
};

export default CommissionUserProvider;
