import useFetchLiveTwoD from "@/hooks/use-fetch-live-two-d";
import { formatTimeIntl } from "@/lib/time";
import { TwoDData } from "@/types";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const ResultsHistory = () => {
	const { liveData } = useFetchLiveTwoD<TwoDData[]>("/2d_result", {
		interval: false,
	});

	return (
		<ScrollView
			className="bg-gray-100"
			contentContainerStyle={{
				padding: 16,
				paddingBottom: 32,
			}}
		>
			{liveData?.map((ch, index) => (
				<View
					key={index}
					className="mb-6 w-full"
				>
					{/* Date Header */}
					<View className="bg-gray-600 px-4 py-2 rounded-t-xl">
						<Text className="text-white font-semibold text-sm">
							📅 {ch.date}
						</Text>
					</View>

					{/* Result Card */}
					<View className="bg-white rounded-b-xl shadow-md overflow-hidden">
						{ch.child.map((data, i) => (
							<View
								key={i}
								className={`px-4 py-4 ${
									i !== ch.child.length - 1 ? "border-b border-gray-200" : ""
								}`}
							>
								{/* Time */}
								<Text className="text-center text-lg font-semibold text-gray-800">
									{formatTimeIntl(data.time)}
								</Text>

								{/* Values */}
								<View className="flex-row justify-between mt-3">
									<ValueBlock
										label="Set"
										value={data.set}
									/>
									<ValueBlock
										label="Value"
										value={data.value}
									/>
									<ValueBlock
										label="2D"
										value={data.twod}
										highlight
									/>
								</View>
							</View>
						))}
					</View>
				</View>
			))}
		</ScrollView>
	);
};

export default ResultsHistory;

/* ---------------- helpers ---------------- */

const ValueBlock = ({
	label,
	value,
	highlight = false,
}: {
	label: string;
	value: string;
	highlight?: boolean;
}) => (
	<View className="flex-1 items-center">
		<Text className="text-xs text-gray-500 uppercase tracking-wide">
			{label}
		</Text>
		<Text
			className={`text-xl font-bold ${
				highlight ? "text-indigo-600" : "text-gray-900"
			}`}
		>
			{value}
		</Text>
	</View>
);
