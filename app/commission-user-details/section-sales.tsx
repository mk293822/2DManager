import WeekSectionSaleList from "@/components/commission-user/week-section-sale-list";
import ManageDatePickerHeader from "@/components/manage/manage-date-picker-header";
import { useCommissionUserDetailsContext } from "@/hooks/commission-user-details/use-details-context";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
	ActivityIndicator,
	Provider as PaperProvider,
} from "react-native-paper";
import { enGB, registerTranslation } from "react-native-paper-dates";

const SectionSales = () => {
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();
	const router = useRouter();

	const userId = Array.isArray(id) ? id[0] : id;
	registerTranslation("en-GB", enGB);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const {
		fetchSectionSalesForWeek,
		weekSectionSales,
		loading,
		error,
		setError,
	} = useCommissionUserDetailsContext();

	useAbortableEffect(
		(signal) => {
			if (!userId) {
				router.replace("/commission-users");
				return;
			}
			fetchSectionSalesForWeek(signal, userId, selectedDate);
		},
		[userId, selectedDate],
	);

	if (!userId) {
		router.replace("/commission-users");
		return;
	}

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4">
				<Text className="text-red-600 font-semibold text-center mb-4">
					{error}
				</Text>
				<Pressable
					onPress={() => {
						setError(null);
						fetchSectionSalesForWeek(new AbortController().signal, userId); // retry
					}}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}

	// Handle loading
	if (loading || !weekSectionSales) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-100 p-4">
				<ActivityIndicator
					size={50}
					color="#2563eb"
				/>
			</View>
		);
	}

	return (
		<PaperProvider>
			<ScrollView
				className="flex-1 bg-gray-100 p-4"
				contentContainerStyle={{ paddingBottom: 120 }}
			>
				<ManageDatePickerHeader
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
					rangeMode={"week"}
				/>

				<WeekSectionSaleList weekSectionSales={weekSectionSales} />
			</ScrollView>
		</PaperProvider>
	);
};

export default SectionSales;
