// components/CompactSession.tsx
import React from "react";
import { Text, View } from "react-native";
import StatRow from "./stat-row";

interface Props {
	title: string;
	stats: {
		totalSold: number;
		exceedTotal: number;
		resoldTotal: number;
		profitLoss: number;
	};
	format: (n: number) => string;
}

const CompactSession: React.FC<Props> = ({ title, stats, format }) => {
	return (
		<View className="pt-3">
			<Text className="text-indigo-700 font-semibold mb-2">{title}</Text>

			<StatRow
				label="Total Sold"
				value={format(stats.totalSold)}
			/>
			<StatRow
				label="Exceed"
				value={format(stats.exceedTotal)}
			/>
			<StatRow
				label="Resold"
				value={format(stats.resoldTotal)}
			/>
			<StatRow
				label="Profit / Loss"
				value={format(stats.profitLoss)}
				highlight
				negative={stats.profitLoss < 0}
			/>
		</View>
	);
};

export default CompactSession;
