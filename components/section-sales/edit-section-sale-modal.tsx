// file: EditSectionSaleModal.tsx

import { EVENT_NAMES } from "@/event-names";
import { BussinessUserSectionEditFields } from "@/hooks/bussiness-user-details/use-bussiness-user-sections-hook";
import { MutationResult } from "@/hooks/use-mutation";
import { isToday } from "@/lib/datetime-helper";
import { eventBus } from "@/lib/event-bus";
import { changeSectionName, ParsedErrors } from "@/lib/helpers";
import {
	BussinessUserType,
	SectionSale,
	SectionSaleGroup,
} from "@/types/bussiness-user-types";
import { SectionName } from "@/types/manage-types";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AppModal from "../ui/app-modal";
import NumericInput from "../ui/numeric-input";

type EditManageSectionModalProps = {
	sectionObj: SectionSale;
	editBussinessUserSection: (variables: {
		sectionId: string;
		form: Partial<SectionSale>;
	}) => Promise<
		MutationResult<
			SectionSaleGroup,
			ParsedErrors<BussinessUserSectionEditFields>
		>
	>;
	onClose: () => void;
	open: boolean;
	bussinessUserType: BussinessUserType;
	date: Date;
	editingSection: boolean;
	section: SectionName;
};

type FormState = {
	commission_percent: number;
	total_amount: number;
	total_draw_value: number;
	draw_times: number;
};

const EditSectionSaleModal = ({
	sectionObj,
	editBussinessUserSection,
	onClose,
	open,
	bussinessUserType,
	date,
	editingSection,
	section,
}: EditManageSectionModalProps) => {
	const [form, setForm] = useState<FormState>({
		total_amount: sectionObj.total_amount,
		commission_percent: sectionObj.commission_percent,
		total_draw_value: sectionObj.total_draw_value,
		draw_times: sectionObj.draw_times ?? 0,
	});

	const [error, setErrors] = useState<
		Partial<Record<BussinessUserSectionEditFields, string>>
	>({});

	// Flexible handleChange: accepts string | number | undefined
	const handleChange = (key: keyof FormState, value: string | number) => {
		const numericValue = Number(value ?? 0);
		setForm((prev) => ({ ...prev, [key]: numericValue }));
	};

	useEffect(() => {
		setForm({
			total_amount: sectionObj.total_amount,
			total_draw_value: sectionObj.total_draw_value,
			commission_percent: sectionObj.commission_percent,
			draw_times: sectionObj.draw_times,
		});
	}, [date, sectionObj]);

	const handleClose = () => {
		setErrors({});
		onClose();
	};

	const handleSave = async () => {
		const payload: Partial<SectionSale> = {
			commission_percent: form.commission_percent,
		};

		if (isToday(date) && sectionObj.numbers_exists) {
			if (bussinessUserType === "resold_user") {
				payload.draw_times = form.draw_times!;
			}
		} else {
			payload.total_amount = form.total_amount!;
			payload.total_draw_value = form.total_draw_value!;

			if (bussinessUserType === "resold_user") {
				payload.draw_times = form.draw_times!;
			}
		}

		const res = await editBussinessUserSection({
			sectionId: sectionObj.id,
			form: payload,
		});

		if (!res.error) {
			handleClose();
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
					Edit {changeSectionName(section)} Section
				</Text>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerClassName="flex-col gap-3"
				>
					{/* Editable only when allowed */}
					{(!isToday(date) || !sectionObj.numbers_exists) && (
						<>
							<NumericInput
								label="Total Amount"
								value={form.total_amount}
								onChange={(val) => handleChange("total_amount", val)}
								error={error.total_amount}
								min={0}
							/>

							<NumericInput
								label="Total Draw Value"
								value={form.total_draw_value}
								onChange={(val) => handleChange("total_draw_value", val)}
								error={error.total_draw_value}
								min={0}
							/>
						</>
					)}

					{/* ALWAYS */}
					<NumericInput
						label="Commission %"
						value={form.commission_percent}
						onChange={(val) => handleChange("commission_percent", val)}
						error={error.commission_percent}
						min={0}
						max={100}
					/>

					{/* ONLY FOR RESOLD USER */}
					{bussinessUserType === "resold_user" && (
						<NumericInput
							label="Draw Times"
							value={form.draw_times}
							onChange={(val) => handleChange("draw_times", val)}
							error={error.draw_times}
							min={0}
							max={100}
						/>
					)}
				</ScrollView>

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

export default EditSectionSaleModal;
