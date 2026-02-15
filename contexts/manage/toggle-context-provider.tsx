import { ManagePageToggleContext } from "@/contexts/contexts";
import useManageHook from "@/hooks/manage/use-manage-hook";
import React from "react";

const ManagePageToggleContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { rangeMode, setRangeMode } = useManageHook();

	return (
		<ManagePageToggleContext.Provider value={{ rangeMode, setRangeMode }}>
			{children}
		</ManagePageToggleContext.Provider>
	);
};

export default ManagePageToggleContextProvider;
