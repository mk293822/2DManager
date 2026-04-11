import { ManageContext } from "@/contexts/contexts";
import useManageHook from "@/hooks/manage/use-manage-hook";
import { SectionRange } from "@/types/manage-types";
import React, { useState } from "react";

const ManageProvider = ({ children }: { children: React.ReactNode }) => {
	const [selectedSectionRange, setSelectedSectionRange] =
		useState<SectionRange>({
			type: "day",
			date: new Date(),
		});

	const data = useManageHook(selectedSectionRange);

	return (
		<ManageContext.Provider
			value={{ ...data, selectedSectionRange, setSelectedSectionRange }}
		>
			{children}
		</ManageContext.Provider>
	);
};

export default ManageProvider;
