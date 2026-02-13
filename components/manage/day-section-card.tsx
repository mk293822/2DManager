import { useManagePageContext } from "@/hooks/use-manage-page-context";
import { changeSectionName, formatKs, getTotalArray } from "@/lib/helpers";
import { Section, SectionName } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DeleteManageSectionModal from "./delete-manage-section-modal";
import EditManageSectionModal from "./edit-manage-section-modal";

const DaySectionCard = ({
	section,
	data,
}: {
	section: SectionName;
	data: Section | null;
}) => {
	const { onSave, handleCreateSection, onConfirmDelete } =
		useManagePageContext();
	const [openModal, setOpenModal] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	if (!data) {
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
					onPress={() => handleCreateSection(section)}
					className="bg-indigo-600 px-6 py-3 rounded-xl shadow"
				>
					<Text className="text-white font-bold">Create</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View className="bg-white rounded-2xl shadow p-6 mb-6">
			<View className="flex-row justify-between items-center mb-2">
				<Text className="text-indigo-700 font-extrabold text-xl">
					{changeSectionName(data.section)}
				</Text>
				<View className="flex-row items-center justify-end gap-3">
					<View
						style={{
							position: "relative",
							marginRight: 5,
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
				<Text className="text-gray-600">Draw Number</Text>
				<Text className="font-extrabold text-indigo-700">
					{data.draw_number ?? "--"}
				</Text>
			</View>
			<View className="flex-row justify-between py-2 border-b border-gray-100">
				<Text className="text-gray-600">Draw Times</Text>
				<Text className="font-extrabold text-red-700">
					&times; {data.draw_times}
				</Text>
			</View>
			<View className="flex-row justify-between pt-3">
				<Text className="font-semibold">Profit / Loss {data.date}</Text>
				<Text
					className={`font-extrabold ${data.profit_or_loss >= 0 ? "text-green-500" : "text-red-500"}`}
				>
					{formatKs(data.profit_or_loss)}
				</Text>
			</View>

			<EditManageSectionModal
				open={openModal}
				onSave={onSave}
				onClose={() => setOpenModal(false)}
				sectionObj={data}
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
