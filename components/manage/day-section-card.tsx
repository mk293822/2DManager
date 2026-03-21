import { SectionSummaryEditFields } from "@/hooks/manage/use-manage-hook";
import {
	changeSectionName,
	formatKs,
	getTotalArray,
	isToday,
	ParsedErrors,
} from "@/lib/helpers";
import { Section, SectionName } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import DeleteManageSectionModal from "./delete-manage-section-modal";
import EditDrawNumberModal from "./edit-draw-number-modal";
import EditManageSectionModal from "./edit-manage-section-modal";

type Props = {
	section: SectionName;
	data: Section | null;
	handleCreateSection: (section: SectionName, date?: Date) => Promise<void>;
	onEditSave: (
		form:
			| {
					draw_number: string | null;
					draw_times: number;
					total_amount: number;
					total_commission: number;
					total_resold: number;
					total_resold_commission: number;
					total_resold_draw_value: number;
					total_draw_value: number;
			  }
			| {
					draw_number: string;
					draw_times: number;
			  },
		id: string,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<SectionSummaryEditFields>;
	}>;
	date: string;
	onConfirmDelete: (id: string, date: string) => Promise<void>;
};

const DaySectionCard = ({
	section,
	data,
	onEditSave,
	handleCreateSection,
	onConfirmDelete,
	date,
}: Props) => {
	const [openModal, setOpenModal] = useState(false);
	const [openDrawNumberModal, setOpenDrawNumberModal] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const d = new Date(date);

	if (!data) {
		const handleCreate = () => {
			try {
				setLoading(true);
				handleCreateSection(section, d);
			} finally {
				setLoading(false);
			}
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
					{loading ? (
						<View className="items-center justify-center">
							<ActivityIndicator
								size={20}
								color="#fff"
							/>
						</View>
					) : (
						<View className="flex-row items-center justify-center gap-2">
							<AntDesign
								name="plus"
								color="#fff"
								size={15}
							/>
							<Text className="text-white font-semibold text-center">
								Create
							</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View className="bg-white rounded-2xl shadow p-6 mb-6">
			<View className="flex-row justify-between items-center mb-2">
				<Text className="text-indigo-600 font-extrabold text-xl">
					{changeSectionName(data.section)}
				</Text>
				<View className="flex-row items-center justify-end gap-3">
					{!data.numbers_exists && !isToday(data.date) && (
						<View
							style={{
								position: "relative",
							}}
						>
							<TouchableOpacity
								onPress={() => setOpenModal(true)}
								activeOpacity={0.85}
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								className="p-2.5"
							>
								<AntDesign
									name="edit"
									color={"#4f46e5"}
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
										borderColor: "#4f46e5",
										borderStyle: "dashed",
										borderRadius: 4,
									}}
									pointerEvents="none"
								/>
							</TouchableOpacity>
						</View>
					)}
					<View
						style={{
							position: "relative",
						}}
					>
						<TouchableOpacity
							onPress={() => setOpenDeleteModal(true)}
							activeOpacity={0.85}
							hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
							className="p-2.5"
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
			{getTotalArray(data).map(([label, value]) => (
				<View
					key={label}
					className="flex-row justify-between py-2 border-b border-gray-100"
				>
					<Text className="text-gray-600">{label}</Text>
					<Text className="font-semibold">{formatKs(value)}</Text>
				</View>
			))}
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Sold Numbers Exists</Text>
				<Text className="font-extrabold">
					{data.numbers_exists ? "Yes" : "No"}
				</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Draw Number</Text>
				<Text className="font-extrabold text-indigo-700">
					{data.draw_number
						? data.draw_number !== ""
							? data.draw_number
							: "--"
						: "--"}
				</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Draw Times</Text>
				<Text className="font-extrabold text-red-700">
					&times; {data.draw_times}
				</Text>
			</View>
			<View className="flex-row justify-between pt-3">
				<Text className="font-semibold">Profit / Loss</Text>
				<Text
					className={`font-extrabold ${data.profit_or_loss >= 0 ? "text-green-500" : "text-red-500"}`}
				>
					{formatKs(data.profit_or_loss)}
				</Text>
			</View>
			{d.toDateString() === new Date().toDateString() && (
				<View className="flex-row items-center gap-2 w-full">
					<TouchableOpacity
						activeOpacity={0.85}
						className="bg-indigo-600 w-1/2 py-3 rounded-xl shadow mt-4 flex-row gap-2 items-center justify-center"
						onPress={() => {
							router.push({
								pathname: "/two-d-lists",
								params: { section: data.section },
							});
						}}
					>
						<AntDesign
							name="unordered-list"
							color={"#fff"}
							size={15}
						/>
						<Text className="text-white font-semibold text-center">
							Numbers
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.85}
						className="bg-green-600 w-1/2 py-3 rounded-xl shadow mt-4 flex-row gap-2 items-center justify-center"
						onPress={() => setOpenDrawNumberModal(true)}
					>
						{data.total_draw_value > 0 ? (
							<AntDesign
								name="edit"
								color={"#fff"}
								size={15}
							/>
						) : (
							<AntDesign
								name="plus"
								color={"#fff"}
								size={15}
							/>
						)}
						<Text className="text-white font-semibold text-center">
							Draw Number
						</Text>
					</TouchableOpacity>
				</View>
			)}

			<EditManageSectionModal
				open={openModal}
				onEditSave={onEditSave}
				onClose={() => setOpenModal(false)}
				sectionObj={data}
			/>
			<EditDrawNumberModal
				open={openDrawNumberModal}
				onClose={() => setOpenDrawNumberModal(false)}
				sectionObj={data}
				onEditSave={onEditSave}
			/>
			<DeleteManageSectionModal
				section_id={data.id}
				open={openDeleteModal}
				onClose={() => setOpenDeleteModal(false)}
				sectionName={data.section}
				onConfirmDelete={onConfirmDelete}
				date={data.date}
			/>
		</View>
	);
};

export default DaySectionCard;
