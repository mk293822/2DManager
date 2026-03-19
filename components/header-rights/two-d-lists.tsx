// components/headers/manage-page-header-right.tsx
import { NumberType } from "@/types/two-d-list-types";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

const TwoDListsPageHeaderRight = ({
	numberType,
	setNumberType,
}: {
	numberType: NumberType;
	setNumberType: React.Dispatch<React.SetStateAction<NumberType>>;
}) => {
	const translateX = useRef(
		new Animated.Value(numberType === "sold_number" ? 0 : 1),
	).current;

	// Animate when numberType changes
	useEffect(() => {
		Animated.timing(translateX, {
			toValue: numberType === "sold_number" ? 0 : 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [numberType]);

	const toggleWidth = 70; // width of each pill
	const translateStyle = {
		transform: [
			{
				translateX: translateX.interpolate({
					inputRange: [0, 1],
					outputRange: [0, toggleWidth], // slide distance
				}),
			},
		],
	};

	return (
		<View
			style={{
				flexDirection: "row",
				backgroundColor: "#f3f4f6",
				borderRadius: 24,
				padding: 2.5,
				width: toggleWidth * 2,
				marginRight: 0,
			}}
		>
			{/* Sliding pill */}
			<Animated.View
				style={{
					position: "absolute",
					top: 2,
					left: 2,
					width: toggleWidth - 4,
					height: 28,
					borderRadius: 20,
					backgroundColor: "#4f46e5",
					...translateStyle,
				}}
			/>

			{(["sold_number", "resold_number"] as NumberType[]).map((item, idx) => {
				const isActive = numberType === item;

				return (
					<TouchableOpacity
						key={item}
						onPress={() => setNumberType(item)}
						activeOpacity={0.8}
						style={{
							width: toggleWidth,
							justifyContent: "center",
							alignItems: "center",
							paddingVertical: 4,
							paddingRight: 2,
						}}
					>
						<Text
							style={{
								color: isActive ? "white" : "#4f46e5",
								fontWeight: "bold",
								fontSize: 14,
							}}
						>
							{item === "sold_number" ? "Normal" : "Resold"}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

export default TwoDListsPageHeaderRight;
