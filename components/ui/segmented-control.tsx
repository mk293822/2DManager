import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

type Option<T> = {
	label: string;
	value: T;
};

type Props<T> = {
	options: Option<T>[];
	value: T;
	onChange: (val: T) => void;
};

function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
}: Props<T>) {
	const translateX = useRef(new Animated.Value(0)).current;

	const [labelWidths, setLabelWidths] = useState<number[]>(
		new Array(options.length).fill(0),
	);

	const index = options.findIndex((o) => o.value === value);

	// -------------------------
	// Animate pill position
	// -------------------------
	useEffect(() => {
		if (labelWidths[index] === 0) return;

		const x = labelWidths.slice(0, index).reduce((sum, w) => sum + w, 0);

		Animated.timing(translateX, {
			toValue: x,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [value, labelWidths]);

	// -------------------------
	// measure exact label width
	// -------------------------
	const onLabelLayout = (i: number, width: number) => {
		setLabelWidths((prev) => {
			const next = [...prev];
			next[i] = width; // 👈 NO padding guesswork
			return next;
		});
	};

	const pillWidth = labelWidths[index] || 0;

	return (
		<View
			style={{
				flexDirection: "row",
				backgroundColor: "#f3f4f6",
				borderRadius: 24,
				padding: 3,
				position: "relative",
			}}
		>
			{/* Sliding pill */}
			{pillWidth > 0 && (
				<Animated.View
					style={{
						position: "absolute",
						top: 3,
						left: 3,
						height: 32,
						borderRadius: 20,
						backgroundColor: "#4f46e5",
						width: pillWidth,
						transform: [{ translateX }],
					}}
				/>
			)}

			{/* Options */}
			{options.map((opt, i) => {
				const isActive = value === opt.value;

				return (
					<TouchableOpacity
						key={opt.value}
						onPress={() => onChange(opt.value)}
						onLayout={(e) => onLabelLayout(i, e.nativeEvent.layout.width)}
						style={{
							paddingVertical: 6,
							paddingHorizontal: 16,
							zIndex: 10,
						}}
					>
						<Text
							style={{
								color: isActive ? "white" : "#4f46e5",
								fontWeight: "bold",
							}}
						>
							{opt.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

export default SegmentedControl;
