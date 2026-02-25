import React from "react";
import { CommissoinUserDetailsHeaderContext } from "./contexts";

const CommissionUserDetailsHeaderContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<CommissoinUserDetailsHeaderContext.Provider value={undefined}>
			{children}
		</CommissoinUserDetailsHeaderContext.Provider>
	);
};

export default CommissionUserDetailsHeaderContextProvider;
