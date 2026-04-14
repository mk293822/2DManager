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

	const H_PADDING = 16;

	const [labelWidths, setLabelWidths] = useState<number[]>(
		new Array(options.length).fill(0),
	);

	const index = options.findIndex((o) => o.value === value);

	// Measure text width only
	const onLabelLayout = (i: number, width: number) => {
		setLabelWidths((prev) => {
			const next = [...prev];
			next[i] = width;
			return next;
		});
	};

	// Animate position
	useEffect(() => {
		if (index === -1 || labelWidths[index] === 0) return;

		const x = labelWidths
			.slice(0, index)
			.reduce((sum, w) => sum + w + H_PADDING * 2, 0);

		Animated.spring(translateX, {
			toValue: x,
			useNativeDriver: true,
		}).start();
	}, [value, labelWidths]);

	const pillWidth = (labelWidths[index] || 0) + H_PADDING * 2;

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
						style={{
							paddingVertical: 6,
							paddingHorizontal: H_PADDING,
							zIndex: 10,
						}}
					>
						<Text
							onLayout={(e) => onLabelLayout(i, e.nativeEvent.layout.width)}
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
