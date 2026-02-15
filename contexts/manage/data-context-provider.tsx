import { ManagePageDataContext } from "@/contexts/contexts";
import useManageHook from "@/hooks/manage/use-manage-hook";
import React from "react";

const ManagePageDataContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const data = useManageHook();

	return (
		<ManagePageDataContext.Provider value={data}>
			{children}
		</ManagePageDataContext.Provider>
	);
};

export default ManagePageDataContextProvider;
