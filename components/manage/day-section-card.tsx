import { useManagePageContext } from "@/hooks/use-manage-page-context";
import { changeSectionName, formatKs, getTotalArray } from "@/lib/helpers";
import { Section, SectionName } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import EditManageSectionModal from "../edit-manage-section-modal";

const DaySectionCard = ({
	section,
	data,
}: {
	section: SectionName;
	data: Section | undefined;
}) => {
	const { onSave, handleCreateSection } = useManagePageContext();
	const [openModal, setOpemModal] = useState(false);

	if (!data) {
		return (
			<View className="bg-white rounded-2xl shadow p-6 mb-6 items-center">
				<Text className="text-gray-400 font-extrabold text-xl mb-2">
					No Data for {changeSectionName(section)} section!
				</Text>
				<Text className="text-gray-500 text-sm text-center mb-4">
					This session has no records yet.
				</Text>
				<TouchableOpacity
					activeOpacity={0.85}
					onPress={() => handleCreateSection(section)}
					className="bg-indigo-600 px-6 py-3 rounded-xl shadow"
				>
					<Text className="text-white font-bold">Create Section</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View className="bg-white rounded-2xl shadow p-6 mb-6">
			<View className="flex-row justify-between items-center mb-4">
				<Text className="text-indigo-700 font-extrabold text-xl">
					{changeSectionName(data.section)}
				</Text>
				<View className="flex-row items-center justify-end gap-5">
					<View
						style={{
							position: "relative",
							marginRight: 5,
						}}
					>
						<TouchableOpacity
							onPress={() => setOpemModal(true)}
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
									top: -8,
									bottom: -8,
									left: -8,
									right: -8,
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
						>
							<AntDesign
								name="delete"
								color={"#b91c1c"}
								size={18}
							/>

							<View
								style={{
									position: "absolute",
									top: -8,
									bottom: -8,
									left: -8,
									right: -8,
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
				onClose={() => setOpemModal(false)}
				sectionObj={data}
			/>
		</View>
	);
};

export default DaySectionCard;
