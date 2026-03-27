import { BussinessUserSectionEditFields } from "@/hooks/bussiness-user-details/use-bussiness-user-sections-hook";
import { MutationResult } from "@/hooks/use-mutation";
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
	bussinessUserType: BussinessUserType;
	createBussinessUserSection: (variables: {
		section: SectionName;
		date: Date;
	}) => Promise<MutationResult<SectionSaleGroup, string>>;
	editBussinessUserSection: (variables: {
		sectionId: string;
		form: Partial<SectionSale>;
	}) => Promise<
		MutationResult<
			SectionSaleGroup,
			ParsedErrors<BussinessUserSectionEditFields>
		>
	>;
	deleteBussinessUserSection: (variables: {
		sectionId: string;
		date: string;
	}) => Promise<MutationResult<void, string>>;
	creatingSection: boolean;
	editingSection: boolean;
	deletingSection: boolean;
	userName: string;
	showBtns?: boolean;
};

const SectionSaleList = ({
	sales,
	userId,
	bussinessUserType,
	editBussinessUserSection,
	editingSection,
	createBussinessUserSection,
	creatingSection,
	deleteBussinessUserSection,
	deletingSection,
	userName,
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
					bussinessUserType={bussinessUserType}
					showBtns={showBtns}
					key={sec}
					sale={sales[sec]}
					userId={userId}
					date={date}
					section={sec}
					userName={userName}
					createBussinessUserSection={createBussinessUserSection}
					creatingSection={creatingSection}
					editBussinessUserSection={editBussinessUserSection}
					editingSection={editingSection}
					deleteBussinessUserSection={deleteBussinessUserSection}
					deletingSection={deletingSection}
				/>
			))}
		</View>
	);
};

export default SectionSaleList;
