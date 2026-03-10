import { EVENT_NAMES } from "@/event-names";
import { useAuthContext } from "@/hooks/use-auth-context";
import { eventBus } from "@/lib/event-bus";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const Register = () => {
	const { register } = useAuthContext();
	const router = useRouter();

	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [loading, setLoading] = useState(false);

	const [errors, setErrors] = useState<
		Partial<Record<"name" | "phone_number" | "password", string>>
	>({});

	const handleRegister = async () => {
		setLoading(true);

		// local password confirmation check
		if (password !== passwordConfirm) {
			setErrors({ password: "Passwords do not match" });
			setPasswordConfirm("");
			setLoading(false);
			return;
		}

		// call hook
		const res = await register(name, phoneNumber, password);

		setLoading(false);

		if (res?.success) {
			setErrors({});
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Registered Successfully",
				description: "You successfully created your account!",
				type: "success",
			});

			setName("");
			setPhoneNumber("");
			setPassword("");
			setPasswordConfirm("");

			router.replace("/profile");
			return;
		}

		// set field errors
		if (res?.errors?.fields) {
			setErrors(res.errors.fields);
		}

		// global/form errors
		if (res?.errors?.form) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Register failed",
				description: res.errors.form,
				type: "error",
			});
		}
	};

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				justifyContent: "center",
				padding: 16,
				backgroundColor: "#f3f4f6",
			}}
			keyboardShouldPersistTaps="handled"
		>
			<View className="bg-white rounded-2xl p-6 gap-5 shadow-sm">
				{/* Title */}
				<View className="gap-1">
					<Text className="text-2xl font-bold">Create account</Text>
					<Text className="text-gray-500 text-sm">Register to get started</Text>
				</View>

				{/* Name */}
				<View className="gap-2">
					<Text className="text-sm font-medium text-gray-600">Full name</Text>
					<TextInput
						onChangeText={(v) => {
							setName(v);
							setErrors((p) => ({ ...p, name: undefined }));
						}}
						value={name}
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Enter your name"
						placeholderTextColor="#9ca3af"
					/>
					{errors.name && (
						<Text className="text-red-500 text-sm">{errors.name}</Text>
					)}
				</View>

				{/* Phone */}
				<View className="gap-2">
					<Text className="text-sm font-medium text-gray-600">
						Phone number
					</Text>
					<TextInput
						onChangeText={(v) => {
							setPhoneNumber(v);
							setErrors((p) => ({ ...p, phone_number: undefined }));
						}}
						value={phoneNumber}
						textContentType="telephoneNumber"
						keyboardType="phone-pad"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Enter phone number"
						placeholderTextColor="#9ca3af"
					/>
					{errors.phone_number && (
						<Text className="text-red-500 text-sm">{errors.phone_number}</Text>
					)}
				</View>

				{/* Password */}
				<View className="gap-2">
					<Text className="text-sm font-medium text-gray-600">Password</Text>
					<TextInput
						onChangeText={(v) => {
							setPassword(v);
							setErrors((p) => ({ ...p, password: undefined }));
						}}
						value={password}
						secureTextEntry
						textContentType="newPassword"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Create password"
						placeholderTextColor="#9ca3af"
					/>
					{errors.password && (
						<Text className="text-red-500 text-sm">{errors.password}</Text>
					)}
				</View>

				{/* Confirm Password */}
				<View className="gap-2">
					<Text className="text-sm font-medium text-gray-600">
						Confirm password
					</Text>
					<TextInput
						onChangeText={setPasswordConfirm}
						value={passwordConfirm}
						secureTextEntry
						textContentType="password"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Confirm password"
						placeholderTextColor="#9ca3af"
					/>
				</View>

				{/* Register Button */}
				<TouchableOpacity
					onPress={handleRegister}
					activeOpacity={0.85}
					className="bg-indigo-400 py-3 rounded-lg mt-2"
				>
					{loading ? (
						<View className="flex-1 items-center justify-center bg-indigo-400">
							<ActivityIndicator
								size={20}
								color="#fff"
							/>
						</View>
					) : (
						<Text className="text-white font-bold text-lg text-center">
							Register
						</Text>
					)}
				</TouchableOpacity>

				{/* Footer */}
				<View className="flex-row justify-center gap-1 mt-2">
					<Text className="text-gray-600">Already have an account?</Text>
					<Link
						href="/login"
						className="text-indigo-500 font-semibold"
					>
						Login
					</Link>
				</View>
			</View>
		</ScrollView>
	);
};

export default Register;
