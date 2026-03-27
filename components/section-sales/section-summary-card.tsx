import { formatDateDisplay } from "@/lib/datetime-helper";
import { formatKs } from "@/lib/helpers";
import { SectionSaleSummary } from "@/types/bussiness-user-types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

/////////////////////////
// Types
/////////////////////////

type BaseProps = {
	summary: SectionSaleSummary;
};

type DayProps = BaseProps & {
	type: "day";
	date: string;
	showDetailsBtn?: boolean;
	handleToggle?: () => void;
};

type WeekProps = BaseProps & {
	type: "week";
};

type Props = DayProps | WeekProps;

/////////////////////////
// Component
/////////////////////////

const SectionSummaryCard = (props: Props) => {
	const { summary } = props;

	const isWeek = props.type === "week";

	const formattedDate =
		props.type === "day" ? formatDateDisplay(new Date(props.date)) : "";

	return (
		<View className="bg-white rounded-2xl shadow p-6 mb-6">
			{/* Header */}
			{isWeek ? (
				<Text className="text-indigo-700 font-extrabold text-2xl">
					Week Summary
				</Text>
			) : (
				<View className="flex-row justify-between items-center mb-2">
					<View>
						<Text className="text-indigo-700 font-extrabold text-2xl">
							Summary
						</Text>
						<Text className="text-gray-500">{formattedDate}</Text>
					</View>

					{props.showDetailsBtn && props.handleToggle && (
						<TouchableOpacity
							onPress={props.handleToggle}
							activeOpacity={0.85}
							className="px-4 py-2 mb-4 -mr-1 rounded-full border border-indigo-600"
						>
							<Text className="text-indigo-600 font-semibold text-sm">
								Details
							</Text>
						</TouchableOpacity>
					)}
				</View>
			)}

			{/* Summary List */}
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Total Sold</Text>
				<Text className="font-semibold">
					{formatKs(summary.total_amount ?? 0)}
				</Text>
			</View>

			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Total Commission</Text>
				<Text className="font-semibold">
					{formatKs(summary.total_commission ?? 0)}
				</Text>
			</View>

			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Total Draw Value</Text>
				<Text className="font-semibold">
					{formatKs(summary.total_draw_value ?? 0)}
				</Text>
			</View>

			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Total Draw Amount</Text>
				<Text className="font-semibold">
					{formatKs(summary.total_draw_amount ?? 0)}
				</Text>
			</View>

			{/* Profit / Loss */}
			<View className="flex-row justify-between pt-3">
				<Text className="font-semibold">Profit / Loss</Text>
				<Text
					className={`font-extrabold ${
						summary.profit_or_loss >= 0 ? "text-green-500" : "text-red-500"
					}`}
				>
					{formatKs(summary.profit_or_loss ?? 0)}
				</Text>
			</View>
		</View>
	);
};

export default SectionSummaryCard;
