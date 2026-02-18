import {
	CommissoinUserHeaderContext,
	CommissoinUserPageContext,
} from "@/contexts/contexts";
import useCommissionUserHook from "@/hooks/commission-users/use-commission-user-hook";
import React from "react";

const CommissionUserPageProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const data = useCommissionUserHook();

	return (
		<CommissoinUserPageContext.Provider value={data}>
			<CommissoinUserHeaderContext.Provider
				value={{ handleCreateCommissionUser: data.handleCreateCommissionUser }}
			>
				{children}
			</CommissoinUserHeaderContext.Provider>
		</CommissoinUserPageContext.Provider>
	);
};

export default CommissionUserPageProvider;
