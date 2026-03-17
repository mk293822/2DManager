import {
	BussinessUserType,
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
	user_name: string;
	createBussinessUserSection: (
		id: string,
		section: SectionName,
		userType: BussinessUserType,
		date?: Date,
	) => Promise<void>;
	deleteBussinessUserSection: (
		id: string,
		bussinessUserId: string,
		section: SectionName,
		userType: BussinessUserType,
	) => Promise<void>;
	userType: BussinessUserType;
};

const SectionSaleList = ({
	sales,
	createBussinessUserSection,
	userId,
	user_name,
	deleteBussinessUserSection,
	userType,
}: Props) => {
	const date = new Date(sales.date);
	const sectionList: SectionName[] = ["morning_section", "evening_section"];

	return (
		<View>
			<View>
				<SectionSummaryCard
					summary={sales.summary}
					date={date}
				/>
			</View>
			{sectionList.map((sec) => (
				<SectionSaleCard
					userType={userType}
					deleteBussinessUserSection={deleteBussinessUserSection}
					key={sec}
					sale={sales[sec]}
					createBussinessUserSection={createBussinessUserSection}
					userId={userId}
					date={date}
					section={sec}
					user_name={user_name}
				/>
			))}
		</View>
	);
};

export default SectionSaleList;
