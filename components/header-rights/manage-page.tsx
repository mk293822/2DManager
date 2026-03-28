// components/headers/manage-page-header-right.tsx
import { RangeMode } from "@/types/manage-types";
import React from "react";
import SegmentedControl from "../ui/segmented-control";

const ManagePageHeaderRight = ({
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

export default ManagePageHeaderRight;
