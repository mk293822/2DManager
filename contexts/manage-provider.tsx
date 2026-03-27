import { ManageContext } from "@/contexts/contexts";
import useManageHook from "@/hooks/manage/use-manage-hook";
import { SectionRange } from "@/types/manage-types";
import React, { useMemo, useState } from "react";

const ManageProvider = ({ children }: { children: React.ReactNode }) => {
	const [selectedSectionRange, setSelectedSectionRange] =
		useState<SectionRange>({
			type: "day",
			date: new Date(),
		});

	const data = useManageHook(selectedSectionRange);

	const contextValue = useMemo(
		() => ({ ...data, selectedSectionRange, setSelectedSectionRange }),
		[data, selectedSectionRange],
	);

	return (
		<ManageContext.Provider value={contextValue}>
			{children}
		</ManageContext.Provider>
	);
};

export default ManageProvider;
