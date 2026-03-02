import { ManageContext } from "@/contexts/contexts";
import useManageHook from "@/hooks/manage/use-manage-hook";
import React from "react";

const ManageProvider = ({ children }: { children: React.ReactNode }) => {
	const data = useManageHook();
	return (
		<ManageContext.Provider value={data}>{children}</ManageContext.Provider>
	);
};

export default ManageProvider;
