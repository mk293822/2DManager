// components/headers/manage-page-header-right.tsx
import { NumberType } from "@/types/two-d-list-types";
import React from "react";
import SegmentedControl from "../ui/segmented-control";

const TwoDListsPageHeaderRight = ({
	numberType,
	setNumberType,
}: {
	numberType: NumberType;
	setNumberType: React.Dispatch<React.SetStateAction<NumberType>>;
}) => {
	return (
		<SegmentedControl
			value={numberType}
			onChange={setNumberType}
			options={[
				{ label: "Normal", value: "sold_number" },
				{ label: "Resold", value: "resold_number" },
			]}
		/>
	);
};

export default TwoDListsPageHeaderRight;
