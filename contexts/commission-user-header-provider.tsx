import { CommissoinUserHeaderContext } from "@/contexts/contexts";
import useCommissionUserHook from "@/hooks/commission-users/use-commission-user-hook";
import React from "react";

const CommissionUserHeaderContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const data = useCommissionUserHook();

	return (
		<CommissoinUserHeaderContext.Provider value={data}>
			{children}
		</CommissoinUserHeaderContext.Provider>
	);
};

export default CommissionUserHeaderContextProvider;
