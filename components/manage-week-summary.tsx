import { formatKs } from "@/lib/helpers";
import { SectionSummaries } from "@/types/manage-types";
import React from "react";
import { Text, View } from "react-native";
import { enGB, registerTranslation } from "react-native-paper-dates";

const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const formatDateDisplay = (date: Date) => {
	const dayName = DAYS[date.getDay()];
	const month = date.toLocaleString("default", { month: "short" });
	return `${dayName}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
};

const ManageWeekSummary = ({
	sections,
}: {
	sections: SectionSummaries[] | undefined;
}) => {
	registerTranslation("en-GB", enGB);

	if (!sections || sections.length === 0) {
		return (
			<View>
				<Text>No data available</Text>
			</View>
		);
	}

	return (
		<>
			{sections.map((section, index) => {
				const { summary, morning, evening } = section;

				const renderSection = (
					name: string,
					data: typeof morning | typeof evening | null,
				) => {
					if (!data) {
						return (
							<View className="bg-gray-100 rounded-xl p-3 mt-3">
								<Text className="text-gray-500 font-medium">
									No {name} for{" "}
									{formatDateDisplay(new Date(section.summary.date))}
								</Text>
							</View>
						);
					}

					return (
						<View className="bg-gray-100 rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
							<Text className="font-semibold text-indigo-600 mb-2">
								{name} Section
							</Text>
							{[
								["Total Sold", data.total_amount],
								["Total Resold", data.total_resold],
								["Total Commission", data.total_commission],
								["Total Draw Amount", data.draw_total_amount],
							].map(([label, value]) => (
								<View
									key={label}
									className="flex-row justify-between py-0.5"
								>
									<Text className="text-gray-500">{label}</Text>
									<Text className="font-semibold">
										{formatKs(value as number)}
									</Text>
								</View>
							))}

							<View className="flex-row justify-between py-0.5">
								<Text className="text-gray-500">Draw Number</Text>
								<Text className="font-semibold">{data.draw_number}</Text>
							</View>
							<View className="flex-row justify-between py-0.5">
								<Text className="text-gray-500">Draw Times</Text>
								<Text className="font-semibold">&times; {data.draw_times}</Text>
							</View>
							<View className="flex-row justify-between mt-1">
								<Text className="font-semibold">Profit / Loss</Text>
								<Text
									className={`font-bold ${
										data.profit_or_loss >= 0 ? "text-green-600" : "text-red-600"
									}`}
								>
									{formatKs(data.profit_or_loss)}
								</Text>
							</View>
						</View>
					);
				};

				if (!morning && !evening) {
					return (
						<View
							key={index}
							className="bg-white rounded-xl p-4 mb-4 items-center justify-center"
						>
							<Text className="text-gray-500 font-medium">
								No sections available for{" "}
								{formatDateDisplay(new Date(summary.date))}
							</Text>
						</View>
					);
				}
				return (
					// Parent card for the whole day
					<View
						key={index}
						className="bg-white rounded-3xl p-4 mb-6 shadow-md"
					>
						{/* Date Header */}
						<Text className="text-indigo-600 font-bold text-xl mb-4">
							{formatDateDisplay(new Date(summary.date))}
						</Text>

						{/* Summary (nested card style) */}
						<View className="bg-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
							<Text className="font-semibold text-gray-700 mb-2">Summary</Text>
							{[
								["Total Sold", summary.total_amount],
								["Total Resold", summary.total_resold],
								["Total Commission", summary.total_commission],
								["Total Draw Amount", summary.draw_total_amount],
							].map(([label, value]) => (
								<View
									key={label}
									className="flex-row justify-between py-1"
								>
									<Text className="text-gray-500">{label}</Text>
									<Text className="font-semibold">
										{formatKs(value as number)}
									</Text>
								</View>
							))}
							<View className="flex-row justify-between mt-2">
								<Text className="font-semibold">Profit / Loss</Text>
								<Text
									className={`font-bold ${
										summary.profit_or_loss >= 0
											? "text-green-600"
											: "text-red-600"
									}`}
								>
									{formatKs(summary.profit_or_loss)}
								</Text>
							</View>
						</View>

						{renderSection("Morning", morning)}
						{renderSection("Evening", evening)}
					</View>
				);
			})}
		</>
	);
};

export default ManageWeekSummary;
