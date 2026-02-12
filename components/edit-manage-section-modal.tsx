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
import AppModal from "./ui/app-modal";

type EditManageSectionModalProps = {
	section: Omit<Section, "id" | "manager">;
	onSave: (updated: Omit<Section, "id" | "manager" | "section">) => void;
	onClose: () => void;
	open: boolean;
};

const EditManageSectionModal = ({
	section,
	onSave,
	onClose,
	open,
}: EditManageSectionModalProps) => {
	const [form, setForm] = useState(section);

	const handleChange = (key: keyof typeof form, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = () => {
		onSave(form);
		onClose();
	};

	return (
		<AppModal open={open}>
			<View className="bg-white w-full flex-col rounded-2xl p-6 py-8 shadow-lg">
				<Text className="text-xl font-bold text-indigo-700 mb-4">
					Edit {changeSectionName(section.section)} Section
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

					{/* Date */}
					<Text className="font-semibold text-gray-700">Date</Text>
					<TextInput
						value={form.date}
						onChangeText={(text) => handleChange("date", text)}
						className="border border-gray-300 rounded-lg px-3 py-2"
						placeholder="YYYY-MM-DD"
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
				<View className="flex-row items-center justify-end mt-4 gap-3">
					<TouchableOpacity
						onPress={onClose}
						className="px-4 py-2 rounded-lg bg-gray-300"
					>
						<Text className="font-semibold text-gray-700">Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleSave}
						className="px-4 py-2 rounded-lg bg-indigo-600"
					>
						<Text className="font-semibold text-white">Save</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AppModal>
	);
};

export default EditManageSectionModal;
