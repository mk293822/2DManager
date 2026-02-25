import { useSectionSalesPageHeaderContext } from "@/hooks/section-sales/use-header-context";
import { RangeMode } from "@/types/manage-types";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

const SectionSalesPageHeaderRight = () => {
	const { rangeMode, setRangeMode } = useSectionSalesPageHeaderContext();
	const translateX = useRef(
		new Animated.Value(rangeMode === "day" ? 0 : 1),
	).current;

	// Animate when rangeMode changes
	useEffect(() => {
		Animated.timing(translateX, {
			toValue: rangeMode === "day" ? 0 : 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [rangeMode]);

	const toggleWidth = 60; // width of each pill
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
			}}
		>
			{/* Sliding pill */}
			<Animated.View
				style={{
					position: "absolute",
					top: 2,
					left: 2,
					width: toggleWidth - 4,
					height: 32,
					borderRadius: 20,
					backgroundColor: "#4f46e5",
					...translateStyle,
				}}
			/>

			{(["day", "week"] as RangeMode[]).map((item, idx) => {
				const isActive = rangeMode === item;

				return (
					<TouchableOpacity
						key={item}
						onPress={() => setRangeMode(item)}
						activeOpacity={0.8}
						style={{
							width: toggleWidth,
							justifyContent: "center",
							alignItems: "center",
							paddingVertical: 6,
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
							{item === "day" ? "Day" : "Week"}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

export default SectionSalesPageHeaderRight;
