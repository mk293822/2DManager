import useManageHook from "@/hooks/use-manage-hook";
import React from "react";
import { ManagePageContext } from "./contexts";

const ManagePageContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const data = useManageHook();

	return (
		<ManagePageContext.Provider value={data}>
			{children}
		</ManagePageContext.Provider>
	);
};

export default ManagePageContextProvider;
