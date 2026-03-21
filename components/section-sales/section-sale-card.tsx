import { useBussinessUserDetailsContext } from "@/hooks/bussiness-user-details/use-context";
import { BussinessUserSectionEditFields } from "@/hooks/bussiness-user-details/use-user-details-hook";
import { useManageContext } from "@/hooks/manage/use-manage-context";
import {
	changeSectionName,
	formatKs,
	formatSmartNumber,
	ParsedErrors,
} from "@/lib/helpers";
import { BussinessUserType, SectionSale } from "@/types/bussiness-user-types";
import { SectionName } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SectinDetailRow } from "../info-components";
import { Loading } from "../loading";
import DeleteSectionSaleModal from "./delete-section-sale-modal";
import EditSectionSaleModal from "./edit-section-sale-modal";

type Props = {
	sale: SectionSale | null;
	userId: string;
	date: Date;
	section: SectionName;
	showBtns?: boolean;
	editBussinessUserSection: (
		id: string,
		userId: string,
		form: Partial<SectionSale>,
		bussinessUserType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserSectionEditFields>;
	}>;
};

const SectionSaleCard = ({
	sale,
	userId,
	date,
	section,
	editBussinessUserSection,
	showBtns = true,
}: Props) => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { fetchSection, sections } = useManageContext();
	const {
		bussinessUserDetails,
		createBussinessUserSection,
		deleteBussinessUserSection,
		bussinessUserType,
	} = useBussinessUserDetailsContext();
	const [open, setOpen] = useState(false);
	const [openEditModal, setOpenEditModal] = useState(false);

	if (!bussinessUserDetails) return;

	if (!sale) {
		const handleCreate = async () => {
			const abortController = new AbortController();
			await createBussinessUserSection(
				userId,
				section,
				bussinessUserType,
				date,
			);
			if (!sections?.[0][section])
				fetchSection(abortController.signal, {
					type: "day",
					date: date,
				});
		};
		return (
			<View className="bg-white rounded-2xl shadow p-6 mb-6 items-center">
				<Text className="text-gray-400 font-extrabold text-xl mb-2">
					No Data for {changeSectionName(section)} Section!
				</Text>
				<Text className="text-gray-500 text-sm text-center mb-4">
					This session has no records yet.
				</Text>
				<TouchableOpacity
					activeOpacity={0.85}
					onPress={handleCreate}
					className="bg-indigo-600 px-6 py-3 rounded-xl shadow"
				>
					<Text className="text-white font-bold">Create</Text>
				</TouchableOpacity>
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
		try {
			setLoading(true);
			await deleteBussinessUserSection(
				sale.id,
				userId,
				section,
				bussinessUserType,
				date.toDateString(),
			);
			const abortController = new AbortController();
			fetchSection(abortController.signal, {
				type: "day",
				date: date,
			});
		} finally {
			setOpen(false);
			setLoading(false);
		}
	};

	return (
		<>
			{loading ? (
				<Loading />
			) : (
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
											"/bussiness-user-details/bussiness-user-two-d-list/[section]",
										params: {
											section: section,
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
			)}

			<DeleteSectionSaleModal
				open={open}
				onClose={() => setOpen(false)}
				handleDelete={handleDelete}
				sectionName={section}
			/>

			<EditSectionSaleModal
				date={date}
				userId={userId}
				onClose={() => setOpenEditModal(false)}
				open={openEditModal}
				sectionObj={sale}
				bussinessUserType={bussinessUserType}
				editBussinessUserSection={editBussinessUserSection}
			/>
		</>
	);
};

export default SectionSaleCard;
