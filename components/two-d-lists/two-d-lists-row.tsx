import { Text, View } from "react-native";

type ListRowNumber = {
	number: string;
	value: number;
};

type Props = {
	left: ListRowNumber;
	right: ListRowNumber;
	limit?: number | null;
	draw_number?: string | null;
};

// Single row component
const TwoDListsRow = ({
	left,
	right,
	limit = null,
	draw_number = null,
}: Props) => (
	<View className="flex-row w-[92%] bg-white rounded-2xl shadow-md mb-3 self-center">
		<View
			className={`${draw_number && left.number === draw_number ? "bg-red-600 rounded-l-2xl" : ""} w-1/2 p-4 flex-row justify-between items-center border-r border-gray-200 pr-4`}
		>
			<Text
				className={`font-extrabold text-xl ${draw_number && draw_number === left.number ? "text-gray-200" : "text-indigo-700"}`}
			>
				{left.number}
			</Text>
			<Text className="text-gray-400 font-bold">→</Text>
			<Text
				className={`px-1 font-semibold text-lg ${draw_number && draw_number === left.number ? "text-gray-200" : limit && left.value > limit ? "text-orange-400 font-bold" : "text-green-600"}`}
			>
				{left.value.toLocaleString()} Ks
			</Text>
		</View>
		{/* Right (optional) */}
		{right ? (
			<View
				className={`${draw_number && right.number === draw_number ? "bg-red-600 rounded-r-2xl" : ""} w-1/2 p-4 flex-row justify-between items-center border-r border-gray-200`}
			>
				<Text
					className={`font-extrabold text-xl ${draw_number && draw_number === right.number ? "text-gray-200" : "text-indigo-700"}`}
				>
					{right.number}
				</Text>
				<Text className="text-gray-400 font-bold">→</Text>
				<Text
					className={`px-1 font-semibold text-lg ${draw_number && draw_number === right.number ? "text-gray-200" : limit && right.value > limit ? "text-orange-400 font-bold" : "text-green-600"}`}
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
