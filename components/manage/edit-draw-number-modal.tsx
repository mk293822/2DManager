import { EVENT_NAMES } from "@/event-names";
import { SectionSummaryEditFields } from "@/hooks/manage/use-manage-hook";
import { eventBus } from "@/lib/event-bus";
import { changeSectionName, ParsedErrors } from "@/lib/helpers";
import { Section } from "@/types/manage-types";
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
	onEditSave: (
		form: {
			draw_number: string;
			draw_times: number;
		},
		id: string,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<SectionSummaryEditFields>;
	}>;
	onClose: () => void;
	open: boolean;
};

const EditDrawNumberModal = ({
	sectionObj,
	onEditSave,
	onClose,
	open,
}: EditManageSectionModalProps) => {
	const [form, setForm] = useState({
		draw_number: sectionObj.draw_number,
		draw_times: sectionObj.draw_times,
	});
	const [loading, setLoading] = useState(false);

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
		try {
			setLoading(true);
			const res = await onEditSave(form, sectionObj.id);
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
						Edit {changeSectionName(sectionObj.section)} Section
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
						{errors.draw_number && (
							<Text className="text-red-500 text-sm">{errors.draw_number}</Text>
						)}

						{/* Draw Times */}
						<Text className="font-semibold text-gray-700">Draw Times</Text>
						<TextInput
							value={form.draw_times.toLocaleString()}
							keyboardType="numeric"
							onChangeText={(text) => {
								const clean = text.replace(/,/g, "");
								handleChange("draw_times", Number(clean || 0));
							}}
							className="border border-gray-300 rounded-lg px-3 py-2"
						/>
						{errors.draw_times && (
							<Text className="text-red-500 text-sm">{errors.draw_times}</Text>
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

export default EditDrawNumberModal;
