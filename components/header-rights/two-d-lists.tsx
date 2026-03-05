// TwoDListsHeaderRight.tsx
import { SectionName } from "@/types/manage-types";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

const TwoDListsHeaderRight = ({
	section,
	setSection,
}: {
	setSection: React.Dispatch<React.SetStateAction<SectionName>>;
	section: SectionName;
}) => {
	const translateX = useRef(
		new Animated.Value(section === "morning_section" ? 0 : 1),
	).current;

	// Animate sliding pill when time changes
	useEffect(() => {
		Animated.timing(translateX, {
			toValue: section === "morning_section" ? 0 : 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [section]);

	const pillWidth = 75; // width of each pill
	const translateStyle = {
		transform: [
			{
				translateX: translateX.interpolate({
					inputRange: [0, 1],
					outputRange: [0, pillWidth], // slide distance
				}),
			},
		],
	};

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: 12,
				marginRight: 20,
			}}
		>
			{/* Morning / Evening Sliding Pill */}
			<View
				style={{
					flexDirection: "row",
					backgroundColor: "#f3f4f6",
					borderRadius: 24,
					padding: 2.5,
					width: pillWidth * 2,
				}}
			>
				{/* Sliding highlight */}
				<Animated.View
					style={{
						position: "absolute",
						top: 2,
						left: 2,
						width: pillWidth - 4,
						height: 32,
						borderRadius: 20,
						backgroundColor: "#4f46e5",
						...translateStyle,
					}}
				/>

				{(["morning_section", "evening_section"] as SectionName[]).map(
					(time) => {
						const isActive = section === time;
						return (
							<TouchableOpacity
								key={time}
								onPress={() => setSection(time)}
								activeOpacity={0.8}
								style={{
									width: pillWidth,
									justifyContent: "center",
									alignItems: "center",
									paddingVertical: 6,
								}}
							>
								<Text
									style={{
										color: isActive ? "white" : "#4f46e5",
										fontWeight: "bold",
										fontSize: 14,
									}}
								>
									{time.charAt(0).toUpperCase() + time.slice(1).slice(0, -8)}{" "}
									{/* Capitalize and remove "_section" */}
								</Text>
							</TouchableOpacity>
						);
					},
				)}
			</View>
		</View>
	);
};

export default TwoDListsHeaderRight;
