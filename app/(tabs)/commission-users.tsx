// app/commission-users.tsx
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type User = {
	id: number;
	name: string;
	totalSold: number;
};

const users: User[] = [
	{ id: 1, name: "John Doe", totalSold: 12500 },
	{ id: 2, name: "Jane Smith", totalSold: 9800 },
	{ id: 3, name: "Alice Johnson", totalSold: 15000 },
	{ id: 4, name: "Bob Brown", totalSold: 7600 },
	{ id: 5, name: "John Doe", totalSold: 12500 },
	{ id: 6, name: "Jane Smith", totalSold: 9800 },
	{ id: 7, name: "Alice Johnson", totalSold: 15000 },
	{ id: 8, name: "Bob Brown", totalSold: 7600 },
	{ id: 9, name: "John Doe", totalSold: 12500 },
	{ id: 10, name: "Jane Smith", totalSold: 9800 },
	{ id: 11, name: "Alice Johnson", totalSold: 15000 },
	{ id: 12, name: "Bob Brown", totalSold: 7600 },
];

const formatKs = (num: number) => `${num.toLocaleString()} Ks`;

const CommissionUsers = () => {
	return (
		<ScrollView
			className="flex-1 bg-gray-100 p-4"
			contentContainerStyle={{ paddingBottom: 120 }}
		>
			{users.map((user) => (
				<TouchableOpacity
					key={user.id}
					onPress={() =>
						router.push({
							pathname: "/commission-user/[id]",
							params: { id: String(user.id) },
						})
					}
					activeOpacity={0.8}
					className="bg-white rounded-2xl shadow p-4 mb-4 flex-row items-center justify-between"
				>
					{/* User info */}
					<View>
						<Text className="text-indigo-700 font-extrabold text-lg">
							{user.name}
						</Text>
						<Text className="text-gray-500 mt-1">
							Total Sold: {formatKs(user.totalSold)}
						</Text>
					</View>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

export default CommissionUsers;
