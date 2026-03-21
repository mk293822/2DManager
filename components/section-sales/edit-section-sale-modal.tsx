import { EVENT_NAMES } from "@/event-names";
import { BussinessUserSectionEditFields } from "@/hooks/bussiness-user-details/use-user-details-hook";
import { eventBus } from "@/lib/event-bus";
import { isToday, ParsedErrors } from "@/lib/helpers";
import { BussinessUserType, SectionSale } from "@/types/bussiness-user-types";
import React, { useEffect, useState } from "react";
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
	date: Date;
};

type FormState = {
	commission_percent: number;
	total_amount?: number;
	total_draw_value?: number;
	draw_times?: number;
};

const EditSectionSaleModal = ({
	sectionObj,
	editBussinessUserSection,
	onClose,
	open,
	bussinessUserType,
	userId,
	date,
}: EditManageSectionModalProps) => {
	const [form, setForm] = useState<FormState>({
		total_amount: sectionObj.total_amount,
		commission_percent: sectionObj.commission_percent,
		total_draw_value: sectionObj.total_draw_value,
		draw_times: sectionObj.draw_times ?? 0, // ✅ added
	});

	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<BussinessUserSectionEditFields, string>>
	>({});

	const handleChange = (key: keyof FormState, value: number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
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
		onClose();
		setErrors({});
	};

	const handleSave = async () => {
		try {
			setLoading(true);

			const payload: Partial<SectionSale> = {
				commission_percent: form.commission_percent,
			};

			if (isToday(date)) {
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

			const res = await editBussinessUserSection(
				sectionObj.id,
				userId,
				payload,
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
						Edit Section Sale
					</Text>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerClassName="flex-col gap-2"
					>
						{!isToday(date) && (
							<>
								<Text className="font-semibold text-gray-700">
									Total Amount
								</Text>
								<TextInput
									value={(form.total_amount ?? 0).toLocaleString()}
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

								<Text className="font-semibold text-gray-700">
									Total Draw Value
								</Text>
								<TextInput
									value={(form.total_draw_value ?? 0).toLocaleString()}
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

						{/* ALWAYS */}
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

						{bussinessUserType === "resold_user" && (
							<>
								<Text className="font-semibold text-gray-700">Draw Times</Text>
								<TextInput
									value={(form.draw_times ?? 0).toString()}
									onChangeText={(text) => {
										handleChange("draw_times", Number(text || 0));
									}}
									className="border border-gray-300 rounded-lg px-3 py-2"
									keyboardType="numeric"
								/>
								{errors.draw_times && (
									<Text className="text-red-500 text-sm">
										{errors.draw_times}
									</Text>
								)}
							</>
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
