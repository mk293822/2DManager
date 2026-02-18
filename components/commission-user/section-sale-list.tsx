import { calculateTotals, formatDateDisplay } from "@/lib/helpers";
import { ComUserSectionSaleType } from "@/types/commission-user-types";
import { SectionName } from "@/types/manage-types";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SectionSaleCard from "./section-sale-card";
import SectionSummaryCard from "./section-summary-card";

type Props = {
	sales: ComUserSectionSaleType[];
};

const SectionSaleList = ({ sales }: Props) => {
	const date = new Date();
	const today = date.toISOString().split("T")[0];
	const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

	// use a map keyed by date + section type
	const createSection = async (section: SectionName, date: Date) => {
		const key = `${date.toISOString()}_${section}`;
		setLoadingMap((prev) => ({ ...prev, [key]: true }));
		setTimeout(
			() => setLoadingMap((prev) => ({ ...prev, [key]: false })),
			5000,
		);
	};

	// filter today’s sales
	const todaySales = sales
		.filter((sale) => sale.section_summary?.date === today)
		.slice(0, 2);

	const summary = calculateTotals(todaySales);

	return (
		<View>
			{todaySales.length === 0 ? (
				<View className="bg-white rounded-2xl p-6 items-center shadow">
					<Text className="text-gray-500 font-medium text-center mb-3">
						No sections available for {formatDateDisplay(date)}
					</Text>

					<Text className="text-gray-400 text-sm text-center mb-4">
						You can create sections for this day below.
					</Text>

					<View className="flex-row gap-3">
						<TouchableOpacity
							activeOpacity={0.85}
							onPress={() => createSection("morning_section", date)}
							disabled={
								loadingMap[`${date.toISOString()}_morning_section`] ||
								loadingMap[`${date.toISOString()}_evening_section`]
							}
							className={`px-4 py-3 rounded-xl shadow flex-1 items-center ${
								loadingMap[`${date.toISOString()}_morning_section`]
									? "bg-gray-400"
									: "bg-indigo-500"
							}`}
						>
							<Text className="text-white font-semibold text-center">
								{loadingMap[`${date.toISOString()}_morning_section`]
									? "Creating…"
									: "Create Morning"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={0.85}
							onPress={() => createSection("evening_section", date)}
							disabled={
								loadingMap[`${date.toISOString()}_morning_section`] ||
								loadingMap[`${date.toISOString()}_evening_section`]
							}
							className={`px-4 py-3 rounded-xl shadow flex-1 items-center ${
								loadingMap[`${date.toISOString()}_evening_section`]
									? "bg-gray-400"
									: "bg-indigo-500"
							}`}
						>
							<Text className="text-white font-semibold text-center">
								{loadingMap[`${date.toISOString()}_evening_section`]
									? "Creating…"
									: "Create Evening"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : (
				<View>
					<Text className="text-lg font-extrabold text-gray-800 mb-3">
						Today’s Sections
					</Text>
					<SectionSummaryCard
						summary={summary}
						date={date}
					/>
				</View>
			)}
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
