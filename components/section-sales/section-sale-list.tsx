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
	user_name: string;
	deleteComUserSection: (
		id: string,
		userId: string,
		section: SectionName,
	) => Promise<void>;
};

const SectionSaleList = ({
	sales,
	createComUserSection,
	userId,
	user_name,
	deleteComUserSection,
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
					deleteComUserSection={deleteComUserSection}
					key={sec}
					sale={sales[sec]}
					createComUserSection={createComUserSection}
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
