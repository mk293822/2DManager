import { BussinessUserSectionEditFields } from "@/hooks/bussiness-user-details/use-user-details-hook";
import { ParsedErrors } from "@/lib/helpers";
import {
	BussinessUserType,
	SectionSale,
	SectionSaleGroup,
} from "@/types/bussiness-user-types";
import { SectionName } from "@/types/manage-types";
import React from "react";
import { View } from "react-native";
import SectionSaleCard from "./section-sale-card";
import SectionSummaryCard from "./section-summary-card";

type Props = {
	sales: SectionSaleGroup;
	userId: string;
	showBtns?: boolean;
	editBussinessUserSection: (
		id: string,
		userId: string,
		form: Partial<SectionSale>,
		bussinessUserType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserSectionEditFields>;
	}>;
};

const SectionSaleList = ({
	sales,
	userId,
	editBussinessUserSection,
	showBtns = true,
}: Props) => {
	const date = new Date(sales.date);
	const sectionList: SectionName[] = ["morning_section", "evening_section"];

	return (
		<View>
			<View>
				<SectionSummaryCard
					type="day"
					summary={sales.summary}
					date={sales.date}
				/>
			</View>
			{sectionList.map((sec) => (
				<SectionSaleCard
					editBussinessUserSection={editBussinessUserSection}
					showBtns={showBtns}
					key={sec}
					sale={sales[sec]}
					userId={userId}
					date={date}
					section={sec}
				/>
			))}
		</View>
	);
};

export default SectionSaleList;
