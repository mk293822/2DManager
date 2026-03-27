// SectionSales.tsx
import DatePickerHeader from "@/components/date-picker-header";
import SectionSalesPageHeaderRight from "@/components/header-rights/section-sales";
import PageWrapper from "@/components/page-wrapper";
import SectionSaleList from "@/components/section-sales/section-sale-list";
import WeekSectionSaleList from "@/components/section-sales/week-section-sale-list";
import useBussinessUserDetailsHook from "@/hooks/bussiness-user-details/use-bussiness-user-details-hook";
import useBussinessUserSectionsHook from "@/hooks/bussiness-user-details/use-bussiness-user-sections-hook";
import { getWeekRangeFromDate } from "@/lib/datetime-helper";
import { BussinessUserType } from "@/types/bussiness-user-types";
import { RangeMode, SectionRange } from "@/types/manage-types";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

const SectionSales = () => {
	const { id, bussinessUserType } = useLocalSearchParams<{
		id: string;
		bussinessUserType: BussinessUserType;
	}>();
	const date = new Date();
	const [refreshing, setRefreshing] = useState(false);
	const [rangeMode, setRangeMode] = useState<RangeMode>("day");
	const [selectedSectionRange, setSelectedSectionRange] =
		useState<SectionRange>({
			type: "day",
			date: date,
		});
	const {
		bussinessUserDetails,
		bussinessUserDetailsLoading,
		bussinessDetailsError,
	} = useBussinessUserDetailsHook(id, bussinessUserType);
	const {
		sectionSales,
		sectionSaleLoading,
		secitonSalesError,
		refetchSectionSales,
		createBussinessUserSection,
		creatingSection,
		deleteBussinessUserSection,
		deletingSection,
		editBussinessUserSection,
		editingSection,
	} = useBussinessUserSectionsHook(id, selectedSectionRange, bussinessUserType);

	useEffect(() => {
		setSelectedSectionRange((prev) => {
			if (!prev) return prev;
			const date = new Date();

			if (rangeMode === "week" && prev.type === "day") {
				const { start, end } = getWeekRangeFromDate(date);
				return {
					type: "week",
					start_date: start,
					end_date: end,
				};
			}
			if (rangeMode === "day" && prev.type === "week") {
				return { type: "day", date: date };
			}
			return prev;
		});
	}, [rangeMode, setSelectedSectionRange]);

	if (!id || !bussinessUserDetails || !bussinessUserType || !sectionSales) {
		return;
	}

	const onRefresh = async () => {
		if (!id) return;
		setRefreshing(true);
		await refetchSectionSales();
		setRefreshing(false);
	};

	// Flatten the content into an array for FlatList
	const flatListData = [{ type: "datePicker" }, { type: "sectionSales" }];

	const renderItem = ({ item }: { item: (typeof flatListData)[0] }) => {
		switch (item.type) {
			case "datePicker":
				return (
					<DatePickerHeader
						selectedSectionRange={selectedSectionRange}
						setSelectedSectionRange={setSelectedSectionRange}
					/>
				);
			case "sectionSales":
				if (rangeMode === "day" && bussinessUserDetails) {
					return (
						<SectionSaleList
							showBtns={false}
							sales={sectionSales[0]}
							userId={id}
							bussinessUserType={bussinessUserType}
							userName={bussinessUserDetails.name}
							createBussinessUserSection={createBussinessUserSection}
							creatingSection={creatingSection}
							editBussinessUserSection={editBussinessUserSection}
							editingSection={editingSection}
							deleteBussinessUserSection={deleteBussinessUserSection}
							deletingSection={deletingSection}
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
			<PageWrapper
				loading={
					(sectionSaleLoading || bussinessUserDetailsLoading) && !refreshing
				}
				error={secitonSalesError || bussinessDetailsError}
				onReload={onRefresh}
				empty={!bussinessUserDetails || !sectionSales}
				emptyMessage="No section sales found for this user."
			>
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
			</PageWrapper>
		</>
	);
};

export default SectionSales;
