import { RangeMode } from "@/types/manage-types";
import React from "react";
import SegmentedControl from "../ui/segmented-control";

const SectionSalesPageHeaderRight = ({
	rangeMode,
	setRangeMode,
}: {
	setRangeMode: React.Dispatch<React.SetStateAction<RangeMode>>;
	rangeMode: RangeMode;
}) => {
	return (
		<SegmentedControl
			value={rangeMode}
			onChange={setRangeMode}
			options={[
				{ label: "Day", value: "day" },
				{ label: "Week", value: "week" },
			]}
		/>
	);
};

export default SectionSalesPageHeaderRight;
