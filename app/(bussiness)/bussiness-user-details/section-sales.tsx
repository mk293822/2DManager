// SectionSales.tsx
import SectionSalesPageHeaderRight from "@/components/header-rights/section-sales";
import { Loading } from "@/components/loading";
import ManageDatePickerHeader from "@/components/manage/manage-date-picker-header";
import SectionSaleList from "@/components/section-sales/section-sale-list";
import WeekSectionSaleList from "@/components/section-sales/week-section-sale-list";
import { useBussinessUserDetailsContext } from "@/hooks/bussiness-user-details/use-context";
import useSectionSalesHook from "@/hooks/section-sales/use-section-sale-hook";
import { useAbortableEffect } from "@/hooks/use-abortable-effect";
import { getWeekOfMonth } from "@/lib/helpers";
import { BussinessUserType } from "@/types/bussiness-user-types";
import { RangeMode, SectionRange } from "@/types/manage-types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

const SectionSales = () => {
	const { id, bussinessUserType } = useLocalSearchParams<{
		id?: string;
		bussinessUserType: BussinessUserType;
	}>();
	const router = useRouter();
	const [rangeMode, setRangeMode] = useState<RangeMode>("day");

	const { fetchSectionSales, sectionSales, loading, error, setError } =
		useSectionSalesHook();
	const {
		deleteBussinessUserSection,
		createBussinessUserSection,
		bussinessUserDetails,
	} = useBussinessUserDetailsContext();

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
			if (!id) {
				router.back();
				return;
			}
			fetchSectionSales(signal, id, selectedSectionRange, bussinessUserType);
		},
		[id, selectedSectionRange],
	);

	const onRefresh = async () => {
		if (!id) return;
		const controller = new AbortController();

		setRefreshing(true);
		setError(null);
		await fetchSectionSales(
			controller.signal,
			id,
			selectedSectionRange,
			bussinessUserType,
			false,
		);
		setRefreshing(false);
	};

	if (!id) {
		router.back();
		return;
	}

	// Flatten the content into an array for FlatList
	const flatListData = [{ type: "datePicker" }, { type: "sectionSales" }];

	if (!sectionSales) return;

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
				if (rangeMode === "day" && bussinessUserDetails) {
					return (
						<SectionSaleList
							deleteBussinessUserSection={deleteBussinessUserSection}
							sales={sectionSales[0]}
							bussinessUserType={bussinessUserType}
							createBussinessUserSection={createBussinessUserSection}
							userId={id}
							user_name={bussinessUserDetails.name}
						/>
					);
				}
				return (
					<WeekSectionSaleList
						setRangeMode={setRangeMode}
						setSelectedSectionRange={setSelectedSectionRange}
						sectionSales={sectionSales}
					/>
				);
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
					headerTitle: () => (
						<View
							style={{
								minHeight: 64,
								justifyContent: "center",
								paddingBottom: 6,
							}}
						>
							<Text
								style={{
									color: "#e5e7eb",
									fontWeight: "600",
									fontSize: 20,
								}}
							>
								Section Sales
							</Text>
						</View>
					),
				}}
			/>
			{loading ? (
				<Loading />
			) : error || !bussinessUserDetails || !sectionSales ? (
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
			) : (
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
					contentContainerStyle={{ padding: 16, paddingBottom: 20, gap: 4 }}
				/>
			)}
		</>
	);
};

export default SectionSales;
