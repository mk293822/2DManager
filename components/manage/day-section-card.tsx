import { SectionSummaryEditFields } from "@/hooks/manage/use-manage-hook";
import { MutationResult } from "@/hooks/use-mutation";
import { isToday } from "@/lib/datetime-helper";
import {
	changeSectionName,
	formatKs,
	getTotalArray,
	ParsedErrors,
} from "@/lib/helpers";
import { Section, SectionName, SectionSummaries } from "@/types/manage-types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import InlineLoadingButton from "../ui/inline-loading-button";
import DeleteManageSectionModal from "./delete-manage-section-modal";
import EditManageSectionModal from "./edit-manage-section-modal";

type Props = {
	sectionName: SectionName;
	section: Section | null;
	date: string;
	createSection: (variables: {
		sectionName: SectionName;
		date?: Date;
	}) => Promise<MutationResult<SectionSummaries, string>>;
	editSection: (variables: {
		form: Partial<Section>;
		id: string;
	}) => Promise<
		MutationResult<SectionSummaries, ParsedErrors<SectionSummaryEditFields>>
	>;
	deleteSection: (variables: {
		id: string;
		date: string;
	}) => Promise<MutationResult<void, string>>;
	creatingSection: boolean;
	editingSection: boolean;
	deletingSection: boolean;
};

type OpenModalStateType = {
	type: "draw_number_edit" | "full_edit";
	open: boolean;
};

const DaySectionCard = ({
	sectionName,
	section,
	date,
	createSection,
	creatingSection,
	editSection,
	editingSection,
	deleteSection,
	deletingSection,
}: Props) => {
	const d = new Date(date);

	const [openModal, setOpenModal] = useState<OpenModalStateType>({
		type: "draw_number_edit",
		open: false,
	});
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [creatingSectionName, setCreatingSectionName] =
		useState<SectionName>("morning_section");

	if (!section) {
		const handleCreate = async () => {
			setCreatingSectionName(sectionName);
			await createSection({ sectionName, date: new Date(date) });
		};
		return (
			<View className="bg-white rounded-2xl shadow p-6 mb-6 items-center">
				<Text className="text-gray-400 font-extrabold text-xl mb-2">
					No Data for {changeSectionName(sectionName)} Section!
				</Text>
				<Text className="text-gray-500 text-sm text-center mb-4">
					This session has no records yet.
				</Text>
				<InlineLoadingButton
					onPress={handleCreate}
					loading={creatingSection && sectionName === creatingSectionName}
					label="Create"
					icon="plus"
				/>
			</View>
		);
	}

	return (
		<>
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<View className="flex-row justify-between items-center mb-2">
					<Text className="text-indigo-600 font-extrabold text-xl">
						{changeSectionName(sectionName)}
					</Text>
					<View className="flex-row items-center justify-end gap-3">
						{(!section.numbers_exists || !isToday(section.date)) && (
							<View
								style={{
									position: "relative",
								}}
							>
								<TouchableOpacity
									onPress={() =>
										setOpenModal({ type: "full_edit", open: true })
									}
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
				{getTotalArray(section).map(([label, value]) => (
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
						{section.numbers_exists ? "Yes" : "No"}
					</Text>
				</View>
				<View className="flex-row justify-between py-2 border-b border-gray-100">
					<Text className="text-gray-600">Draw Number</Text>
					<Text className="font-extrabold text-indigo-700">
						{section.draw_number
							? section.draw_number !== ""
								? section.draw_number
								: "--"
							: "--"}
					</Text>
				</View>
				<View className="flex-row justify-between py-2 border-b border-gray-100">
					<Text className="text-gray-600">Draw Times</Text>
					<Text className="font-extrabold text-red-700">
						&times; {section.draw_times}
					</Text>
				</View>
				<View className="flex-row justify-between pt-3">
					<Text className="font-semibold">Profit / Loss</Text>
					<Text
						className={`font-extrabold ${section.profit_or_loss >= 0 ? "text-green-500" : "text-red-500"}`}
					>
						{formatKs(section.profit_or_loss)}
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
									params: {
										sectionName: sectionName,
										id: section.id,
										draw_number: section.draw_number,
									},
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
							onPress={() =>
								setOpenModal({
									type: "draw_number_edit",
									open: true,
								})
							}
						>
							{section.total_draw_value > 0 ? (
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
			</View>
			<EditManageSectionModal
				open={openModal.open}
				onClose={() => setOpenModal({ type: openModal.type, open: false })}
				sectionObj={section}
				editSection={editSection}
				editingSection={editingSection}
				isDrawNumberEdit={openModal.type === "draw_number_edit"}
			/>
			<DeleteManageSectionModal
				section_id={section.id}
				open={openDeleteModal}
				onClose={() => setOpenDeleteModal(false)}
				sectionName={sectionName}
				deleteSection={deleteSection}
				deletingSection={deletingSection}
				date={section.date}
			/>
		</>
	);
};

export default DaySectionCard;
