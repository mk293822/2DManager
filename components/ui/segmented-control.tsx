// file: components/SegmentedControl.tsx

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
	const [width, setWidth] = useState(0);

	const index = options.findIndex((o) => o.value === value);

	useEffect(() => {
		if (width === 0) return;

		Animated.timing(translateX, {
			toValue: index,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [value, width]);

	const itemWidth = width / options.length;

	const translateStyle = {
		transform: [
			{
				translateX: translateX.interpolate({
					inputRange: options.map((_, i) => i),
					outputRange: options.map((_, i) => i * itemWidth),
				}),
			},
		],
	};

	return (
		<View
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
			style={{
				flexDirection: "row",
				backgroundColor: "#f3f4f6",
				borderRadius: 24,
				padding: 3,
			}}
		>
			{/* Sliding pill */}
			{width > 0 && (
				<Animated.View
					style={{
						position: "absolute",
						top: 3,
						left: 3,
						width: itemWidth - 6,
						height: 32,
						borderRadius: 20,
						backgroundColor: "#4f46e5",
						...translateStyle,
					}}
				/>
			)}

			{options.map((opt) => {
				const isActive = value === opt.value;

				return (
					<TouchableOpacity
						key={opt.value}
						onPress={() => onChange(opt.value)}
						style={{
							alignItems: "center",
							justifyContent: "center",
							paddingVertical: 6,
							paddingHorizontal: 16,
						}}
					>
						<Text
							style={{
								color: isActive ? "white" : "#4f46e5",
								fontWeight: "bold",
								textAlign: "center",
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
