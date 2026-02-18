import {
	ManagePageDataContext,
	ManagePageToggleContext,
} from "@/contexts/contexts";
import useManageHook from "@/hooks/manage/use-manage-hook";
import React from "react";

const ManagePageProvider = ({ children }: { children: React.ReactNode }) => {
	const data = useManageHook();

	return (
		<ManagePageDataContext.Provider value={data}>
			<ManagePageToggleContext.Provider
				value={{ rangeMode: data.rangeMode, setRangeMode: data.setRangeMode }}
			>
				{children}
			</ManagePageToggleContext.Provider>
		</ManagePageDataContext.Provider>
	);
};

export default ManagePageProvider;
