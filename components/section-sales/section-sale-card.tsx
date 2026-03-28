import { EVENT_NAMES } from "@/event-names";
import { BussinessUserSectionEditFields } from "@/hooks/bussiness-user-details/use-bussiness-user-sections-hook";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import { MutationResult } from "@/hooks/use-mutation";
import { formatDateRequest } from "@/lib/datetime-helper";
import { eventBus } from "@/lib/event-bus";
import {
	changeSectionName,
	formatKs,
	formatSmartNumber,
	ParsedErrors,
} from "@/lib/helpers";
import {
	BussinessUserType,
	SectionSale,
	SectionSaleGroup,
} from "@/types/bussiness-user-types";
import { SectionName } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SectinDetailRow } from "../info-components";
import InlineLoadingButton from "../ui/inline-loading-button";
import DeleteSectionSaleModal from "./delete-section-sale-modal";
import EditSectionSaleModal from "./edit-section-sale-modal";

type Props = {
	sale: SectionSale | null;
	userId: string;
	date: Date;
	section: SectionName;
	bussinessUserType: BussinessUserType;
	userName: string;
	createBussinessUserSection: (variables: {
		section: SectionName;
		date: Date;
	}) => Promise<MutationResult<SectionSaleGroup, string>>;
	editBussinessUserSection: (variables: {
		sectionId: string;
		form: Partial<SectionSale>;
	}) => Promise<
		MutationResult<
			SectionSaleGroup,
			ParsedErrors<BussinessUserSectionEditFields>
		>
	>;
	deleteBussinessUserSection: (variables: {
		sectionId: string;
		date: string;
	}) => Promise<MutationResult<void, string>>;
	creatingSection: boolean;
	editingSection: boolean;
	deletingSection: boolean;
	showBtns?: boolean;
};

const SectionSaleCard = ({
	sale,
	userId,
	date,
	section,
	bussinessUserType,
	userName,
	editBussinessUserSection,
	editingSection,
	createBussinessUserSection,
	creatingSection,
	deleteBussinessUserSection,
	deletingSection,
	showBtns = true,
}: Props) => {
	const router = useRouter();
	const { sections, refetch: refetchSectionSummary } = useManageContext();
	const [open, setOpen] = useState(false);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [creatingSectionName, setCreatingSectionName] =
		useState<SectionName>("morning_section");

	if (!sale) {
		const handleCreate = async () => {
			setCreatingSectionName(section);
			await createBussinessUserSection({
				section,
				date,
			});
			if (!sections?.[0][section]) refetchSectionSummary();
		};
		return (
			<View className="bg-white rounded-2xl shadow p-6 mb-6 items-center">
				<Text className="text-gray-400 font-extrabold text-xl mb-2">
					No Data for {changeSectionName(section)} Section!
				</Text>
				<Text className="text-gray-500 text-sm text-center mb-4">
					This session has no records yet.
				</Text>
				<InlineLoadingButton
					onPress={handleCreate}
					loading={creatingSection && creatingSectionName === section}
					label="Create"
					icon="plus"
				/>
			</View>
		);
	}

	const isProfit = sale?.profit_or_loss >= 0;

	const sectionDetails: { label: string; value: string }[] = [
		{
			label: "Commission %",
			value: `${formatSmartNumber(sale.commission_percent)}%`,
		},
		{
			label: "Total Amount",
			value: formatKs(sale.total_amount),
		},
		{
			label: "Total Commission",
			value: formatKs(sale.total_commission),
		},
		{
			label: "Include Draw Number",
			value: sale.include_draw_number ? "Yes" : "No",
		},
		{
			label: "Numbers Exists",
			value: sale.numbers_exists ? "Yes" : "No",
		},
		{
			label: "Total Draw Value",
			value: formatKs(sale.total_draw_value),
		},
		{
			label: "Total Draw Amount",
			value: formatKs(sale.total_draw_amount),
		},
		{
			label: "Draw Number",
			value: sale.draw_number
				? sale.draw_number !== ""
					? sale.draw_number
					: "--"
				: "--",
		},
		{
			label: "Draw Times",
			value: `x ${sale.draw_times}`,
		},
	];

	const handleDelete = async () => {
		const res = await deleteBussinessUserSection({
			sectionId: sale.id,
			date: formatDateRequest(date),
		});

		if (res.error) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Error",
				description: res.error,
			});
		} else {
			refetchSectionSummary();
		}
	};

	return (
		<>
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				{/* Header */}
				<View className="flex-row justify-between items-center mb-2">
					<Text className="text-indigo-700 font-extrabold text-xl">
						{changeSectionName(section)}
					</Text>
					<View className="flex-row items-center justify-end gap-3">
						<View
							style={{
								position: "relative",
							}}
						>
							<TouchableOpacity
								activeOpacity={0.85}
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								className="p-2.5"
								onPress={() => setOpenEditModal(true)}
							>
								<AntDesign
									name="edit"
									color={"#4338ca"}
									size={18}
								/>

								<View
									style={{
										position: "absolute",
										top: -0,
										bottom: -0,
										left: -0,
										right: -0,
										borderWidth: 1,
										borderColor: "#4338ca",
										borderStyle: "dashed",
										borderRadius: 4,
									}}
									pointerEvents="none"
								/>
							</TouchableOpacity>
						</View>

						<View
							style={{
								position: "relative",
							}}
						>
							<TouchableOpacity
								activeOpacity={0.85}
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								className="p-2.5"
								onPress={() => setOpen(true)}
							>
								<AntDesign
									name="delete"
									color={"#b91c1c"}
									size={18}
								/>

								<View
									style={{
										position: "absolute",
										top: -0,
										bottom: -0,
										left: -0,
										right: -0,
										borderWidth: 1,
										borderColor: "#b91c1c",
										borderStyle: "dashed",
										borderRadius: 4,
									}}
									pointerEvents="none"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				{/* Section Details */}
				{sectionDetails.map((sec) => (
					<SectinDetailRow
						key={sec.label}
						label={sec.label}
						value={sec.value}
					/>
				))}
				<View className="flex-row justify-between pt-3">
					<Text className="font-semibold">Profit / Loss</Text>
					<Text
						className={`font-extrabold ${
							isProfit ? "text-green-500" : "text-red-500"
						}`}
					>
						{formatKs(sale.profit_or_loss)}
					</Text>
				</View>

				{showBtns && date.toDateString() === new Date().toDateString() && (
					<View className="flex-row items-center gap-2 w-full">
						<TouchableOpacity
							activeOpacity={0.85}
							className="bg-indigo-600 w-1/2 py-3 rounded-xl shadow mt-4 flex-row gap-2 items-center justify-center"
							onPress={() =>
								router.push({
									pathname:
										"/bussiness-user-details/bussiness-user-two-d-list/[id]",
									params: {
										id: sale.id,
										section: section,
										userName,
										draw_times: sale.draw_times,
										bussinessUserType,
									},
								})
							}
						>
							<AntDesign
								name="history"
								color={"#fff"}
								size={15}
							/>
							<Text className="text-white font-semibold text-center">
								History
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.85}
							className="bg-green-600 w-1/2 py-3 rounded-xl shadow mt-4 flex-row gap-2 items-center justify-center"
							onPress={() =>
								router.push({
									pathname:
										"/bussiness-user-details/bussiness-user-two-d-list/create-two-d-numbers",
									params: {
										section: section,
										id: userId,
										bussinessUserType,
									},
								})
							}
						>
							<AntDesign
								name="plus"
								color={"#fff"}
								size={15}
							/>
							<Text className="text-white font-semibold text-center">
								Add Numbers
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>

			<DeleteSectionSaleModal
				open={open}
				onClose={() => setOpen(false)}
				handleDelete={handleDelete}
				sectionName={section}
				deletingSection={deletingSection}
			/>

			<EditSectionSaleModal
				date={date}
				onClose={() => setOpenEditModal(false)}
				open={openEditModal}
				sectionObj={sale}
				bussinessUserType={bussinessUserType}
				editBussinessUserSection={editBussinessUserSection}
				editingSection={editingSection}
			/>
		</>
	);
};

export default SectionSaleCard;
