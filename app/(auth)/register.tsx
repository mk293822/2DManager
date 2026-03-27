import { EVENT_NAMES } from "@/event-names";
import { useAuthContext } from "@/hooks/auth/use-auth-context";
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
	const { register, registering } = useAuthContext();
	const router = useRouter();

	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const [error, setErrors] = useState<
		Partial<Record<"name" | "phone_number" | "password", string>>
	>({});

	const handleRegister = async () => {
		// local password confirmation check
		if (password !== passwordConfirm) {
			setErrors({ password: "Passwords do not match" });
			setPasswordConfirm("");
			return;
		}

		// call hook
		const res = await register({ name, phone_number: phoneNumber, password });

		if (!res?.error) {
			setErrors({});
			setName("");
			setPhoneNumber("");
			setPassword("");
			setPasswordConfirm("");

			router.replace("/profile");
			return;
		} else if (res.error.form && Object.keys(res.error.fields).length === 0) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Register Failed",
				description: res.error.form,
			});
		} else {
			setErrors(res.error.fields);
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
					{error.name && (
						<Text className="text-red-500 text-sm">{error.name}</Text>
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
					{error.phone_number && (
						<Text className="text-red-500 text-sm">{error.phone_number}</Text>
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
						textContentType="password"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Create password"
						placeholderTextColor="#9ca3af"
					/>
					{error.password && (
						<Text className="text-red-500 text-sm">{error.password}</Text>
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
						textContentType="newPassword"
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
					{registering ? (
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
