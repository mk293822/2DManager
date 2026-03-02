import React from "react";
import { CommissionUserDetailsHeaderContext } from "./contexts";

const CommissionUserDetailsHeaderContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<CommissionUserDetailsHeaderContext.Provider value={undefined}>
			{children}
		</CommissionUserDetailsHeaderContext.Provider>
	);
};

export default CommissionUserDetailsHeaderContextProvider;
