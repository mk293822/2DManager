import { SectionContext } from "@/contexts/contexts";
import { SectionName } from "@/types/manage-types";
import React from "react";

const TwoDListsHeaderContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [section, setSection] = React.useState<SectionName>("morning_section");

	return (
		<SectionContext.Provider value={{ section, setSection }}>
			{children}
		</SectionContext.Provider>
	);
};

export default TwoDListsHeaderContextProvider;
