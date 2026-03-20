import { EVENT_NAMES } from "@/event-names";
import { BussinessUserSectionEditFields } from "@/hooks/section-sales/use-section-sale-hook";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors } from "@/lib/helpers";
import { BussinessUserType, SectionSale } from "@/types/bussiness-user-types";
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
	sectionObj: SectionSale;
	editBussinessUserSection: (
		id: string,
		userId: string,
		form: Partial<SectionSale>,
		bussinessUserType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserSectionEditFields>;
	}>;
	onClose: () => void;
	open: boolean;
	bussinessUserType: BussinessUserType;
	userId: string;
};

const EditSectionSaleModal = ({
	sectionObj,
	editBussinessUserSection,
	onClose,
	open,
	bussinessUserType,
	userId,
}: EditManageSectionModalProps) => {
	const [form, setForm] = useState({
		total_amount: sectionObj.total_amount,
		commission_percent: sectionObj.commission_percent,
		total_draw_value: sectionObj.total_draw_value,
	});
	const [loading, setLoading] = useState(false);

	const [errors, setErrors] = useState<
		Partial<Record<BussinessUserSectionEditFields, string>>
	>({});
	const handleChange = (key: keyof typeof form, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleClose = () => {
		onClose();
		setErrors({});
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			const res = await editBussinessUserSection(
				sectionObj.id,
				userId,
				form,
				bussinessUserType,
			);
			if (res.success) {
				handleClose();
				setErrors({});
				return;
			}

			if (res.errors.form && Object.keys(res.errors.fields).length === 0) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Edit Failed",
					description: res.errors.form,
				});
			} else {
				setErrors(res.errors.fields);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<AppModal open={open}>
			{loading ? (
				<View className="bg-gray-100 w-1/2 h-40 flex-col rounded-2xl p-6 py-8 shadow-lg">
					<Loading />
				</View>
			) : (
				<View className="bg-gray-100 w-full flex-col rounded-2xl p-6 py-8 shadow-lg">
					<Text className="text-xl font-bold text-indigo-700 mb-4">
						Edit Draw Number
					</Text>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerClassName="flex-col gap-2"
					>
						{/* Draw Number */}
						<Text className="font-semibold text-gray-700">Total Amount</Text>
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
						{/* Draw Number */}
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
						{/* Draw Number */}
						<Text className="font-semibold text-gray-700">Commission %</Text>
						<TextInput
							value={form.commission_percent.toLocaleString()}
							onChangeText={(text) => {
								const clean = text.replace(/,/g, "");
								handleChange("commission_percent", Number(clean || 0));
							}}
							className="border border-gray-300 rounded-lg px-3 py-2"
							keyboardType="numeric"
						/>
						{errors.commission_percent && (
							<Text className="text-red-500 text-sm">
								{errors.commission_percent}
							</Text>
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
							disabled={loading}
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

export default EditSectionSaleModal;
