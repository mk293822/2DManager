// EditManageSectionModal.tsx
import { EVENT_NAMES } from "@/event-names";
import { SectionSummaryEditFields } from "@/hooks/manage/use-manage-hook";
import { MutationResult } from "@/hooks/use-mutation";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors } from "@/lib/helpers";
import { Section, SectionSummaries } from "@/types/manage-types";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AppModal from "../ui/app-modal";
import NumericInput from "../ui/numeric-input";
import TwoDigitInput from "../ui/two-digit-input";

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
		<AppModal
			open={open}
			loading={editingSection}
		>
			<View className="bg-gray-100 w-full flex-col rounded-2xl p-6 py-8 shadow-lg">
				<Text className="text-xl font-bold text-indigo-700 mb-4">
					Edit Section
				</Text>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerClassName="flex-col gap-3"
				>
					<TwoDigitInput
						label="Draw Number"
						value={form.draw_number}
						onChange={(val) => handleChange("draw_number", val)}
						error={errors.draw_number}
					/>

					<NumericInput
						label="Draw Times"
						value={form.draw_times}
						onChange={(val) => handleChange("draw_times", val)}
						error={errors.draw_times}
						min={0}
						max={100}
					/>

					{!isDrawNumberEdit && (
						<>
							<NumericInput
								label="Total Amount"
								value={form.total_amount}
								onChange={(val) => handleChange("total_amount", val)}
								error={errors.total_amount}
							/>

							<NumericInput
								label="Total Commission"
								value={form.total_commission}
								onChange={(val) => handleChange("total_commission", val)}
								error={errors.total_commission}
							/>

							<NumericInput
								label="Total Resold"
								value={form.total_resold}
								onChange={(val) => handleChange("total_resold", val)}
								error={errors.total_resold}
							/>

							<NumericInput
								label="Total Resold Commission"
								value={form.total_resold_commission}
								onChange={(val) => handleChange("total_resold_commission", val)}
								error={errors.total_resold_commission}
							/>

							<NumericInput
								label="Total Resold Draw Value"
								value={form.total_resold_draw_value}
								onChange={(val) => handleChange("total_resold_draw_value", val)}
								error={errors.total_resold_draw_value}
							/>

							<NumericInput
								label="Total Resold Draw Amount"
								value={form.total_resold_draw_amount}
								onChange={(val) =>
									handleChange("total_resold_draw_amount", val)
								}
								error={errors.total_resold_draw_amount}
							/>

							<NumericInput
								label="Total Draw Value"
								value={form.total_draw_value}
								onChange={(val) => handleChange("total_draw_value", val)}
								error={errors.total_draw_value}
							/>
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
		</AppModal>
	);
};

export default EditManageSectionModal;
