// EditManageSectionModal.tsx
import { EVENT_NAMES } from "@/event-names";
import { SectionSummaryEditFields } from "@/hooks/manage/use-manage-hook";
import { MutationResult } from "@/hooks/use-mutation";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors } from "@/lib/helpers";
import { Section, SectionSummaries } from "@/types/manage-types";
import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Loading } from "../loading";
import AppModal from "../ui/app-modal";

type EditManageSectionModalProps = {
	sectionObj: Section;
	editSection: (variables: {
		form: Partial<Section>;
		id: string;
	}) => Promise<
		MutationResult<SectionSummaries, ParsedErrors<SectionSummaryEditFields>>
	>;
	editingSection: boolean;
	onClose: () => void;
	open: boolean;
	isDrawNumberEdit: boolean;
};

const EditManageSectionModal = ({
	sectionObj,
	editSection,
	onClose,
	open,
	editingSection,
	isDrawNumberEdit,
}: EditManageSectionModalProps) => {
	const {
		draw_number,
		draw_times,
		total_amount,
		total_commission,
		total_resold,
		total_resold_commission,
		total_resold_draw_value,
		total_resold_draw_amount,
		total_draw_value,
	} = sectionObj;

	const [form, setForm] = useState({
		draw_number: draw_number || "",
		draw_times,
		total_amount,
		total_commission,
		total_resold,
		total_resold_commission,
		total_resold_draw_value,
		total_draw_value,
		total_resold_draw_amount,
	});

	const [errors, setErrors] = useState<
		Partial<Record<SectionSummaryEditFields, string>>
	>({});

	const handleChange = (key: keyof typeof form, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleClose = () => {
		onClose();
		setErrors({});
	};

	const handleSave = async () => {
		const payload: Partial<Section> = isDrawNumberEdit
			? {
					draw_number: form.draw_number,
					draw_times: form.draw_times,
				}
			: form;

		const res = await editSection({ form: payload, id: sectionObj.id });

		if (!res.error) {
			handleClose();
			setErrors({});
			return;
		} else if (res.error.form && Object.keys(res.error.fields).length === 0) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Edit Failed",
				description: res.error.form,
			});
		} else {
			setErrors(res.error.fields);
		}
	};

	return (
		<AppModal open={open}>
			{editingSection ? (
				<View className="bg-gray-100 w-1/2 h-40 flex-col rounded-2xl p-6 py-8 shadow-lg">
					<Loading />
				</View>
			) : (
				<View className="bg-gray-100 w-full flex-col rounded-2xl p-6 py-8 shadow-lg">
					<Text className="text-xl font-bold text-indigo-700 mb-4">
						Edit Section
					</Text>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerClassName="flex-col gap-2"
					>
						{/* Draw Number */}
						<Text className="font-semibold text-gray-700">Draw Number</Text>
						<TextInput
							value={form.draw_number || ""}
							onChangeText={(text) => handleChange("draw_number", text)}
							className="border border-gray-300 rounded-lg px-3 py-2"
							keyboardType="numeric"
						/>
						{errors.draw_number && (
							<Text className="text-red-500 text-sm">{errors.draw_number}</Text>
						)}

						{/* Draw Times */}
						<Text className="font-semibold text-gray-700">Draw Times</Text>
						<TextInput
							value={form.draw_times.toLocaleString()}
							onChangeText={(text) => {
								const clean = text.replace(/,/g, "");
								handleChange("draw_times", Number(clean || 0));
							}}
							className="border border-gray-300 rounded-lg px-3 py-2"
							keyboardType="numeric"
						/>
						{errors.draw_times && (
							<Text className="text-red-500 text-sm">{errors.draw_times}</Text>
						)}
						{!isDrawNumberEdit && (
							<>
								{/* Total Amount */}
								<Text className="font-semibold text-gray-700">
									Total Amount
								</Text>
								<TextInput
									value={form.total_amount.toLocaleString()}
									onChangeText={(text) => {
										const clean = text.replace(/,/g, "");
										handleChange("total_amount", Number(clean || 0));
									}}
									className="border border-gray-300 rounded-lg px-3 py-2"
									keyboardType="numeric"
								/>
								{errors.total_amount && (
									<Text className="text-red-500 text-sm">
										{errors.total_amount}
									</Text>
								)}
								{/* Total Commission */}
								<Text className="font-semibold text-gray-700">
									Total Commission
								</Text>
								<TextInput
									value={form.total_commission.toLocaleString()}
									onChangeText={(text) => {
										const clean = text.replace(/,/g, "");
										handleChange("total_commission", Number(clean || 0));
									}}
									className="border border-gray-300 rounded-lg px-3 py-2"
									keyboardType="numeric"
								/>
								{errors.total_commission && (
									<Text className="text-red-500 text-sm">
										{errors.total_commission}
									</Text>
								)}
								{/* Total Resold */}
								<Text className="font-semibold text-gray-700">
									Total Resold
								</Text>
								<TextInput
									value={form.total_resold.toLocaleString()}
									onChangeText={(text) => {
										const clean = text.replace(/,/g, "");
										handleChange("total_resold", Number(clean || 0));
									}}
									className="border border-gray-300 rounded-lg px-3 py-2"
									keyboardType="numeric"
								/>
								{errors.total_resold && (
									<Text className="text-red-500 text-sm">
										{errors.total_resold}
									</Text>
								)}
								{/* Total Resold Commission */}
								<Text className="font-semibold text-gray-700">
									Total Resold Commission
								</Text>
								<TextInput
									value={form.total_resold_commission.toLocaleString()}
									onChangeText={(text) => {
										const clean = text.replace(/,/g, "");
										handleChange("total_resold_commission", Number(clean || 0));
									}}
									className="border border-gray-300 rounded-lg px-3 py-2"
									keyboardType="numeric"
								/>
								{errors.total_resold_commission && (
									<Text className="text-red-500 text-sm">
										{errors.total_resold_commission}
									</Text>
								)}
								{/* Total Resold Draw Value */}
								<Text className="font-semibold text-gray-700">
									Total Resold Draw Value
								</Text>
								<TextInput
									value={form.total_resold_draw_value.toLocaleString()}
									onChangeText={(text) => {
										const clean = text.replace(/,/g, "");
										handleChange("total_resold_draw_value", Number(clean || 0));
									}}
									className="border border-gray-300 rounded-lg px-3 py-2"
									keyboardType="numeric"
								/>
								{errors.total_resold_draw_value && (
									<Text className="text-red-500 text-sm">
										{errors.total_resold_draw_value}
									</Text>
								)}
								{/* Total Resold Draw Value */}
								<Text className="font-semibold text-gray-700">
									Total Resold Draw Amount
								</Text>
								<TextInput
									value={form.total_resold_draw_amount.toLocaleString()}
									onChangeText={(text) => {
										const clean = text.replace(/,/g, "");
										handleChange(
											"total_resold_draw_amount",
											Number(clean || 0),
										);
									}}
									className="border border-gray-300 rounded-lg px-3 py-2"
									keyboardType="numeric"
								/>
								{errors.total_resold_draw_amount && (
									<Text className="text-red-500 text-sm">
										{errors.total_resold_draw_amount}
									</Text>
								)}
								{/* Total Draw Value */}
								<Text className="font-semibold text-gray-700">
									Total Draw Value
								</Text>
								<TextInput
									value={form.total_draw_value.toLocaleString()}
									onChangeText={(text) => {
										const clean = text.replace(/,/g, "");
										handleChange("total_draw_value", Number(clean || 0));
									}}
									className="border border-gray-300 rounded-lg px-3 py-2"
									keyboardType="numeric"
								/>
								{errors.total_draw_value && (
									<Text className="text-red-500 text-sm">
										{errors.total_draw_value}
									</Text>
								)}
							</>
						)}
					</ScrollView>

					{/* Buttons */}
					<View
						className="w-full flex-row items-center mt-4 gap-2"
						style={{ justifyContent: "flex-end" }}
					>
						<TouchableOpacity
							onPress={handleClose}
							className="px-4 py-2 rounded-lg bg-white border border-gray-300"
						>
							<Text className="font-semibold text-gray-700">Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleSave}
							disabled={editingSection}
							className="px-4 py-2 rounded-lg bg-indigo-600 disabled:bg-indigo-400"
						>
							<Text className="font-semibold text-white">Save</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</AppModal>
	);
};

export default EditManageSectionModal;
