import {
	ComUserSectionSaleSummary,
	ComUserSectionSaleType,
} from "@/types/commission-user-types";
import React from "react";
import { Text, View } from "react-native";
import SectionSaleCard from "./section-sale-card";
import SectionSummaryCard from "./section-summary-card";

type Props = {
	sales: ComUserSectionSaleType[];
};

function calculateTotals(
	sections: (ComUserSectionSaleType | null | undefined)[],
): ComUserSectionSaleSummary {
	return sections.reduce(
		(acc, section) => {
			if (!section) return acc;

			acc.total_amount += section.total_amount ?? 0;
			acc.total_commission += section.total_commission ?? 0;
			acc.profit_or_loss += section.profit_or_loss ?? 0;
			acc.total_draw_amount += section.total_draw_amount ?? 0;

			return acc;
		},
		{
			total_amount: 0,
			total_commission: 0,
			profit_or_loss: 0,
			total_draw_amount: 0,
		},
	);
}

//

const SectionSaleList = ({ sales }: Props) => {
	const today = new Date().toISOString().split("T")[0];

	const todaySales = sales
		.filter(
			(sale) => sale.section_summary && sale.section_summary.date === today,
		)
		.slice(0, 2);

	const summary = calculateTotals(todaySales);

	if (todaySales.length === 0) {
		return (
			<View className="bg-white rounded-2xl p-8 items-center">
				<Text className="text-gray-500 font-semibold">
					No section sales for today
				</Text>
			</View>
		);
	}

	return (
		<View>
			<Text className="text-lg font-extrabold text-gray-800 mb-3">
				Today’s Sections
			</Text>
			<SectionSummaryCard
				summary={summary}
				date={new Date()}
			/>
			{todaySales.map((sale) => (
				<SectionSaleCard
					key={sale.id}
					sale={sale}
				/>
			))}
		</View>
	);
};

export default SectionSaleList;
