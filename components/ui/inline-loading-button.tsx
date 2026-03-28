import AntDesign from "@expo/vector-icons/AntDesign";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type Props = {
	onPress: () => void;
	loading: boolean;
	label: string;
	icon?: keyof typeof AntDesign.glyphMap;
};

const InlineLoadingButton = ({ onPress, label, loading, icon }: Props) => {
	return (
		<TouchableOpacity
			activeOpacity={0.85}
			onPress={onPress}
			disabled={loading}
			className="bg-indigo-500 px-6 py-3 rounded-xl shadow"
		>
			{loading ? (
				<View className="items-center justify-center">
					<ActivityIndicator
						size={20}
						color="#fff"
					/>
				</View>
			) : (
				<View className="flex-row items-center justify-center gap-2">
					{icon && (
						<AntDesign
							name={icon}
							color="#fff"
							size={15}
						/>
					)}
					<Text className="text-white font-semibold text-center">{label}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

export default InlineLoadingButton;
