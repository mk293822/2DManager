import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const ResoldNumbers = () => {
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();

	return (
		<>
			<View>
				<Text>{id}</Text>
			</View>
		</>
	);
};

export default ResoldNumbers;
