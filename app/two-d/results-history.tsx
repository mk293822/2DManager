import useFetchLiveTwoD from "@/hooks/use-fetch-live-two-d";
import { TwoDData } from "@/types";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const options = ["Real Time", "11:00:00", "12:00:00", "15:00:00", "16:30:00"];

const ResultsHistory = () => {
	// 2d_history?open_time=11:00:00
	const { liveData } = useFetchLiveTwoD<TwoDData[]>("/2d_result");

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: "center",
			}}
		>
			<View>
				<Text>{JSON.stringify(liveData)}</Text>
			</View>
		</ScrollView>
	);
};

export default ResultsHistory;
