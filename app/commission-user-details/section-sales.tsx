// SectionSales.tsx
import SectionSalesPageHeaderRight from "@/components/header-rights/section-sales";
import { Loading } from "@/components/loading";
import ManageDatePickerHeader from "@/components/manage/manage-date-picker-header";
import WeekSectionSaleList from "@/components/section-sales/week-section-sale-list";
import useSectionSalesHook from "@/hooks/section-sales/use-section-sale-hook";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { getWeekOfMonth } from "@/lib/helpers";
import { RangeMode, SectionRange } from "@/types/manage-types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { enGB, registerTranslation } from "react-native-paper-dates";

const SectionSales = () => {
	const { id } = useLocalSearchParams<{ id?: string | string[] }>();
	const router = useRouter();
	const [rangeMode, setRangeMode] = useState<RangeMode>("day");
	const userId = Array.isArray(id) ? id[0] : id;
	registerTranslation("en-GB", enGB);

	const { fetchSectionSales, sectionSales, loading, error, setError } =
		useSectionSalesHook();

	const date = new Date();
	const [selectedSectionRange, setSelectedSectionRange] =
		useState<SectionRange>({
			type: "day",
			date: date,
		});
	const [refreshing, setRefreshing] = useState(false);

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
				return { type: "day", date: date };
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

	const onRefresh = async () => {
		if (!userId) return;
		setRefreshing(true);
		setError(null);
		await fetchSectionSales(
			new AbortController().signal,
			userId,
			selectedSectionRange,
		);
		setRefreshing(false);
	};

	if (!userId) {
		router.replace("/commission-users");
		return null;
	}

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-4">
				<Text className="text-red-600 font-semibold text-center mb-4">
					{error}
				</Text>
				<Pressable
					onPress={onRefresh}
					className="bg-indigo-600 px-6 py-3 rounded-lg"
				>
					<Text className="text-white font-semibold">Reload</Text>
				</Pressable>
			</View>
		);
	}

	if (loading || !sectionSales) {
		return <Loading />;
	}

	// Flatten the content into an array for FlatList
	const flatListData = [{ type: "datePicker" }, { type: "sectionSales" }];

	const renderItem = ({ item }: { item: (typeof flatListData)[0] }) => {
		switch (item.type) {
			case "datePicker":
				return (
					<ManageDatePickerHeader
						selectedSectionRange={selectedSectionRange}
						setSelectedSectionRange={setSelectedSectionRange}
					/>
				);
			case "sectionSales":
				return <WeekSectionSaleList sectionSales={sectionSales} />;
			default:
				return null;
		}
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<SectionSalesPageHeaderRight
							rangeMode={rangeMode}
							setRangeMode={setRangeMode}
						/>
					),
				}}
			/>
			<PaperProvider>
				<FlatList
					data={flatListData}
					renderItem={renderItem}
					keyExtractor={(item, index) => item.type + index}
					refreshControl={
						<RefreshControl
							colors={["#0000ff"]}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					contentContainerStyle={{ padding: 16, paddingBottom: 20, gap: 16 }}
				/>
			</PaperProvider>
		</>
	);
};

export default SectionSales;
