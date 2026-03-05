import { Text, View } from "react-native";

type ListRowNumber = {
	number: string;
	value: number;
};

type Props = {
	left: ListRowNumber;
	right: ListRowNumber;
	limit?: number | null;
};

// Single row component
const TwoDListsRow = ({ left, right, limit = null }: Props) => (
	<View className="flex-row p-4 gap-4 w-[92%] bg-white rounded-2xl shadow-md mb-3 self-center">
		<View className="w-1/2 flex-row justify-between items-center border-r border-gray-200 pr-4">
			<Text className="font-extrabold text-xl text-indigo-700">
				{left.number}
			</Text>
			<Text className="text-gray-400 font-bold">→</Text>
			<Text
				className={`px-1 font-semibold text-lg ${limit && left.value > limit ? "text-orange-400 font-bold" : "text-green-600"}`}
			>
				{left.value.toLocaleString()} Ks
			</Text>
		</View>
		{/* Right (optional) */}
		{right ? (
			<View className="w-1/2 flex-row justify-between items-center pr-4">
				<Text className="font-extrabold text-xl text-indigo-700">
					{right.number}
				</Text>
				<Text className="text-gray-400 font-bold">→</Text>
				<Text
					className={`px-1 font-semibold text-lg ${limit && right.value > limit ? "text-orange-400 font-bold" : "text-green-600"}`}
				>
					{right.value.toLocaleString()} Ks
				</Text>
			</View>
		) : (
			<View className="w-1/2" /> // keep spacing for layout
		)}
	</View>
);

export default TwoDListsRow;
