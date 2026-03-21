// CreateBussinessUserModal.tsx
import { EVENT_NAMES } from "@/event-names";
import { BussinessUserEditFields } from "@/hooks/bussiness-user-details/use-user-details-hook";
import { eventBus } from "@/lib/event-bus";
import { ParsedErrors } from "@/lib/helpers";
import { BussinessUserType } from "@/types/bussiness-user-types";
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

type Props = {
	open: boolean;
	onClose: () => void;
	handleCreateBussinessUser: (
		payload: {
			name: string;
			phone_number: string;
			default_commission_percent: number;
			default_draw_times?: number;
		},
		bussinessUserType: BussinessUserType,
	) => Promise<{
		success: boolean;
		errors: ParsedErrors<BussinessUserEditFields>;
	}>;
	bussinessUserType: BussinessUserType;
};

type FormState = {
	name: string;
	phone_number: string;
	default_commission_percent: number;
	default_draw_times?: number;
};

type CreatePayload =
	| { name: string; phone_number: string; default_commission_percent: number } // commission_user
	| {
			name: string;
			phone_number: string;
			default_commission_percent: number;
			default_draw_times: number;
	  }; // resold_user

const CreateBussinessUserModal = ({
	open,
	onClose,
	handleCreateBussinessUser,
	bussinessUserType,
}: Props) => {
	const [form, setForm] = useState<FormState>({
		name: "",
		phone_number: "",
		default_commission_percent: Number(
			process.env.EXPO_PUBLIC_DEFAULT_COMMISSION_PERCENT ?? 0,
		),
		default_draw_times: Number(process.env.EXPO_PUBLIC_DEFAULT_DRAW_TIMES ?? 0),
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<BussinessUserEditFields, string>>
	>({});

	const handleChange = (key: keyof FormState, value: string | number) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const onCloseModal = () => {
		onClose();
		setForm({
			name: "",
			phone_number: "",
			default_commission_percent: Number(
				process.env.EXPO_PUBLIC_DEFAULT_COMMISSION_PERCENT ?? 0,
			),
			default_draw_times: Number(
				process.env.EXPO_PUBLIC_DEFAULT_DRAW_TIMES ?? 0,
			),
		});
		setErrors({});
	};

	const handleSave = async () => {
		setLoading(true);
		try {
			const payload: CreatePayload =
				bussinessUserType === "resold_user"
					? {
							name: form.name,
							phone_number: form.phone_number,
							default_commission_percent: form.default_commission_percent,
							default_draw_times: form.default_draw_times!,
						}
					: {
							name: form.name,
							phone_number: form.phone_number,
							default_commission_percent: form.default_commission_percent,
						};
			const res = await handleCreateBussinessUser(payload, bussinessUserType);

			if (res.success) {
				onCloseModal();
				return;
			}

			if (res.errors.form && Object.keys(res.errors.fields).length === 0) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Creation Failed",
					description: res.errors.form,
				});
			} else {
				setErrors(res.errors.fields);
			}
		} catch (err) {
			console.error(err);
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
				<View className="bg-gray-100 w-full max-w-md mx-auto flex-col rounded-2xl p-6 py-8 shadow-lg">
					<Text className="text-xl font-bold text-indigo-700 mb-4">
						Create{" "}
						{bussinessUserType === "commission_user" ? "Commission" : "Resold"}{" "}
						User
					</Text>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ gap: 12 }}
					>
						<Text className="font-semibold text-gray-700">Name</Text>
						<TextInput
							value={form.name}
							onChangeText={(text) => handleChange("name", text)}
							className="border border-gray-300 rounded-lg px-3 py-2"
						/>
						{errors.name && (
							<Text className="text-red-500 text-sm">{errors.name}</Text>
						)}

						<Text className="font-semibold text-gray-700">Phone Number</Text>
						<TextInput
							value={form.phone_number}
							keyboardType="numeric"
							onChangeText={(text) => handleChange("phone_number", text)}
							className="border border-gray-300 rounded-lg px-3 py-2"
						/>
						{errors.phone_number && (
							<Text className="text-red-500 text-sm">
								{errors.phone_number}
							</Text>
						)}

						<Text className="font-semibold text-gray-700">
							Default Commission %
						</Text>
						<TextInput
							value={String(form.default_commission_percent)}
							keyboardType="numeric"
							maxLength={3}
							onChangeText={(text) =>
								handleChange(
									"default_commission_percent",
									Number(text.replace(/,/g, "")),
								)
							}
							className="border border-gray-300 rounded-lg px-3 py-2"
						/>
						{errors.default_commission_percent && (
							<Text className="text-red-500 text-sm">
								{errors.default_commission_percent}
							</Text>
						)}

						{bussinessUserType === "resold_user" && (
							<>
								<Text className="font-semibold text-gray-700">
									Default Draw Times
								</Text>
								<TextInput
									value={String(form.default_draw_times)}
									keyboardType="numeric"
									maxLength={2}
									onChangeText={(text) =>
										handleChange(
											"default_draw_times",
											Number(text.replace(/,/g, "")),
										)
									}
									className="border border-gray-300 rounded-lg px-3 py-2"
								/>
								{errors.default_draw_times && (
									<Text className="text-red-500 text-sm">
										{errors.default_draw_times}
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
							onPress={onCloseModal}
							className="px-4 py-2 rounded-lg bg-white border border-gray-300"
						>
							<Text className="font-semibold text-gray-700">Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleSave}
							disabled={loading}
							className="px-4 py-2 rounded-lg bg-indigo-600 disabled:bg-indigo-400 border border-indigo-600"
						>
							<Text className="font-semibold text-white">Save</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</AppModal>
	);
};

export default CreateBussinessUserModal;
