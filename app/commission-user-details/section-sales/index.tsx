import ManageDatePickerHeader from "@/components/manage/manage-date-picker-header";
import WeekSectionSaleList from "@/components/section-sales/week-section-sale-list";
import { useSectionSalesPageHeaderContext } from "@/hooks/section-sales/use-header-context";
import useSectionSalesHook from "@/hooks/section-sales/use-section-sale-hook";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { getWeekOfMonth } from "@/lib/helpers";
import { SectionRange } from "@/types/manage-types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
	const { rangeMode } = useSectionSalesPageHeaderContext();
	const { fetchSectionSales, sectionSales, loading, error, setError } =
		useSectionSalesHook();

	const date = new Date();

	const [selectedSectionRange, setSelectedSectionRange] =
		useState<SectionRange>({
			type: "day",
			date: date,
		});

	useEffect(() => {
		setSelectedSectionRange((prev) => {
			if (!prev) return prev;
			if (rangeMode === "week" && prev.type === "day") {
				return {
					type: "week",
					year: date.getFullYear(),
					month: date.getMonth(),
					week: getWeekOfMonth(date),
				};
			}
			if (rangeMode === "day" && prev.type === "week") {
				return {
					type: "day",
					date: date,
				};
			}

			return prev;
		});
	}, [rangeMode]);

	useAbortableEffect(
		(signal) => {
			if (!userId) {
				router.replace("/commission-users");
				return;
			}
			fetchSectionSales(signal, userId, selectedSectionRange);
		},
		[userId, selectedSectionRange],
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
						fetchSectionSales(
							new AbortController().signal,
							userId,
							selectedSectionRange,
						); // retry
					}}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}

	// Handle loading
	if (loading || !sectionSales) {
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
					selectedSectionRange={selectedSectionRange}
					setSelectedSectionRange={setSelectedSectionRange}
				/>

				<WeekSectionSaleList sectionSales={sectionSales} />
			</ScrollView>
		</PaperProvider>
	);
};

export default SectionSales;
