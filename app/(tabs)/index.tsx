import TimelyResultCard from "@/components/timely-result-card";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { api } from "@/lib/api";
import { TwoDResponse } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	const [liveData, setLiveData] = useState<TwoDResponse | null>(null);

	useAbortableEffect((signal) => {
		async function fetchLive2D() {
			const { data } = await api.get("/live", { signal });
			setLiveData(data);
		}

		fetchLive2D();
	}, []);

	return (
		<SafeAreaView className="flex-1">
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					alignItems: "center",
					justifyContent: "center",
					paddingVertical: 16,
					paddingBottom: 64,
				}}
			>
				<Text className="text-[10rem] font-extrabold font-serif shadow-lg">
					{liveData?.live.twod}
				</Text>
				<View className="flex-row gap-2 -mt-4 items-center justify-center">
					<AntDesign
						name="check"
						size={20}
						color="#16a34a"
					/>
					<Text>Updated</Text>
					<Text>{liveData?.live.time}</Text>
				</View>
				<View className="flex-col gap-4 py-4 w-full items-center">
					{liveData?.result.reverse().map((data, index) => (
						<TimelyResultCard
							key={index}
							data={data}
						/>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
