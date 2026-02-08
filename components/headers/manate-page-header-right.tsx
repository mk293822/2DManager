// components/headers/manage-page-header-right.tsx
import { EVENT_NAMES } from "@/event-names";
import { eventBus } from "@/lib/event-bus";
import { RangeMode } from "@/types/event-bus";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ManagePageHeaderRight = () => {
	const handleToggle = (value: RangeMode) => {
		eventBus.emit(EVENT_NAMES.CHANGE_DATE_RANGE, value);
	};

	return (
		<View
			style={{
				flexDirection: "row",
				backgroundColor: "#f3f4f6",
				borderRadius: 20,
				padding: 2,
				marginRight: 8,
			}}
		>
			{(["today", "week"] as RangeMode[]).map((item) => (
				<TouchableOpacity
					key={item}
					onPress={() => handleToggle(item)}
					activeOpacity={0.7} // controls press feedback
					style={{
						paddingHorizontal: 12,
						paddingVertical: 6,
						backgroundColor: "white",
						borderRadius: 16,
						marginHorizontal: 2,
					}}
				>
					<Text style={{ color: "#4f46e5", fontWeight: "bold" }}>
						{item === "today" ? "Today" : "Week"}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

export default ManagePageHeaderRight;
