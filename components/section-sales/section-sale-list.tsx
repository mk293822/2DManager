import { SectionSaleGroup } from "@/types/commission-user-types";
import { SectionName } from "@/types/manage-types";
import React from "react";
import { Text, View } from "react-native";
import CommissionUserSectionCard from "./section-sale-card";
import SectionSummaryCard from "./section-summary-card";

type Props = {
	sales: SectionSaleGroup;
	createComUserSection: (
		id: string,
		section: SectionName,
		date?: Date,
	) => Promise<void>;
	userId: string;
	userName: string;
};

const SectionSaleList = ({
	sales,
	createComUserSection,
	userId,
	userName,
}: Props) => {
	const date = new Date(sales.date);
	const sectionList: SectionName[] = ["morning_section", "evening_section"];

	return (
		<View>
			<View>
				<Text className="text-lg font-extrabold text-gray-800 mb-3">
					Today’s Sections
				</Text>
				<SectionSummaryCard
					summary={sales.summary}
					date={date}
				/>
			</View>
			{sectionList.map((sec) => (
				<CommissionUserSectionCard
					key={sec}
					sale={sales[sec]}
					createComUserSection={createComUserSection}
					userId={userId}
					date={date}
					section={sec}
					userName={userName}
				/>
			))}
		</View>
	);
};

export default SectionSaleList;
