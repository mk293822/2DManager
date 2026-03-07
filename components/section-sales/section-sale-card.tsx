import useManageHook from "@/hooks/manage/use-manage-hook";
import { changeSectionName, formatKs, formatSmartNumber } from "@/lib/helpers";
import { ComUserSectionSaleType } from "@/types/commission-user-types";
import { SectionName } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SectinDetailRow } from "../info-components";
import { Loading } from "../loading";

type Props = {
	sale: ComUserSectionSaleType;
	createComUserSection: (
		id: string,
		section: SectionName,
		date?: Date,
	) => Promise<void>;
	userId: string;
	date: Date;
	section: SectionName;
	user_name: string;
	deleteComUserSection: (
		id: string,
		userId: string,
		section: SectionName,
	) => Promise<void>;
};

const CommissionUserSectionCard = ({
	sale,
	createComUserSection,
	userId,
	date,
	section,
	user_name,
	deleteComUserSection,
}: Props) => {
	const section_summary = sale?.section_summary;
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { fetchSection } = useManageHook();
	const [open, setOpen] = useState(false);

	const isProfit = sale?.profit_or_loss >= 0;

	if (!sale || !section_summary) {
		const handleCreate = async () => {
			await createComUserSection(userId, section, date);
			if (!section_summary)
				fetchSection(new AbortController().signal, {
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
			label: "Total Draw Amount",
			value: formatKs(sale.total_draw_amount),
		},
		{
			label: "Draw Number",
			value: section_summary.draw_number
				? section_summary.draw_number !== ""
					? section_summary.draw_number
					: "--"
				: "--",
		},
		{
			label: "Draw Times",
			value: `x ${section_summary.draw_times}`,
		},
	];

	const handleDelete = async () => {
		setLoading(true);
		await deleteComUserSection(sale.id, userId, section);
		setLoading(false);
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
							{changeSectionName(section_summary.section)}
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
									onPress={handleDelete}
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

					<View className="flex-row items-center gap-2 w-full">
						<TouchableOpacity
							activeOpacity={0.85}
							className="bg-indigo-600 w-1/2 py-3 rounded-xl shadow mt-4 flex-row gap-2 items-center justify-center"
							onPress={() =>
								router.push({
									pathname: "/com-user-two-d-list/[id]",
									params: {
										id: String(sale.id),
										user_name: user_name,
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
									pathname: "/com-user-two-d-list/create-two-d-numbers",
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
				</View>
			)}
		</>
	);
};

export default CommissionUserSectionCard;
