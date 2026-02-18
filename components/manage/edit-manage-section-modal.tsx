import { changeSectionName } from "@/lib/helpers";
import { Section } from "@/types/manage-types";
import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import AppModal from "../ui/app-modal";

type EditManageSectionModalProps = {
	sectionObj: Section;
	onSave: (
		form: Omit<Section, "id" | "manager" | "section" | "date">,
		id: string,
	) => Promise<void>;
	onClose: () => void;
	open: boolean;
};

const EditManageSectionModal = ({
	sectionObj,
	onSave,
	onClose,
	open,
}: EditManageSectionModalProps) => {
	const { id, manager, section, date, ...payload } = sectionObj;
	const [form, setForm] = useState(payload);

	const handleChange = (key: keyof typeof form, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = async () => {
		console.log(form);
		await onSave(form, id);
		onClose();
	};

	return (
		<AppModal open={open}>
			<View className="bg-gray-100 w-full flex-col rounded-2xl p-6 py-8 shadow-lg">
				<Text className="text-xl font-bold text-indigo-700 mb-4">
					Edit {changeSectionName(section)} Section
				</Text>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerClassName="flex-col gap-2"
				>
					{/* Draw Number */}
					<Text className="font-semibold text-gray-700">Draw Number</Text>
					<TextInput
						value={form.draw_number}
						onChangeText={(text) => handleChange("draw_number", text)}
						className="border border-gray-300 rounded-lg px-3 py-2"
						keyboardType="numeric"
					/>

					{/* Draw Times */}
					<Text className="font-semibold text-gray-700">Draw Times</Text>
					<TextInput
						value={form.draw_times.toString()}
						keyboardType="numeric"
						onChangeText={(text) => handleChange("draw_times", text)}
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>

					{/* Total Amount */}
					<Text className="font-semibold text-gray-700">Total Amount</Text>
					<TextInput
						value={form.total_amount.toString()}
						onChangeText={(text) =>
							handleChange("total_amount", parseFloat(text) || 0)
						}
						keyboardType="numeric"
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>

					{/* Total Commission */}
					<Text className="font-semibold text-gray-700">Total Commission</Text>
					<TextInput
						value={form.total_commission.toString()}
						onChangeText={(text) =>
							handleChange("total_commission", parseFloat(text) || 0)
						}
						keyboardType="numeric"
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>

					{/* Total Resold */}
					<Text className="font-semibold text-gray-700">Total Resold</Text>
					<TextInput
						value={form.total_resold.toString()}
						onChangeText={(text) =>
							handleChange("total_resold", parseFloat(text) || 0)
						}
						keyboardType="numeric"
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>

					{/* Draw Total Amount */}
					<Text className="font-semibold text-gray-700">Draw Total Amount</Text>
					<TextInput
						value={form.draw_total_amount.toString()}
						onChangeText={(text) =>
							handleChange("draw_total_amount", parseFloat(text) || 0)
						}
						keyboardType="numeric"
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>

					{/* Profit / Loss */}
					<Text className="font-semibold text-gray-700">Profit / Loss</Text>
					<TextInput
						value={form.profit_or_loss.toString()}
						onChangeText={(text) =>
							handleChange("profit_or_loss", parseFloat(text) || 0)
						}
						keyboardType="numeric"
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>
				</ScrollView>

				{/* Buttons */}
				<View
					className="w-full flex-row items-center mt-4 gap-2"
					style={{ justifyContent: "flex-end" }}
				>
					<TouchableOpacity
						onPress={onClose}
						className="px-4 py-2 rounded-lg bg-white border border-gray-300"
					>
						<Text className="font-semibold text-gray-700">Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleSave}
						className="px-4 py-2 rounded-lg bg-indigo-600 border border-indigo-600"
					>
						<Text className="font-semibold text-white">Save</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AppModal>
	);
};

export default EditManageSectionModal;
