import { EVENT_NAMES } from "@/event-names";
import { useAuthContext } from "@/hooks/use-auth-context";
import { eventBus } from "@/lib/event-bus";
import { AxiosError, isCancel } from "axios";
import { Link } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const Register = () => {
	const { register } = useAuthContext();
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const handleRegister = async () => {
		if (password !== passwordConfirm) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Passwords doesn't match!",
				description: "Your password and confirm password doesn't match!",
				type: "error",
			});
			setPasswordConfirm("");
			return;
		}
		try {
			await register(name, phoneNumber, password);
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Registered Successfuly",
				description: "You successfully registered your account!",
				type: "success",
			});

			setPhoneNumber("");
			setName("");
			navigate("/profile");
		} catch (err) {
			if (isCancel(err)) return;
			if (err instanceof AxiosError) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					title:
						err.response?.data?.message || err.message || "Register failed",
					description:
						"There was a problem registering your account. Please try again.",
					type: "error",
				});
			} else {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					title: "Register failed ",
					description:
						"There was a problem registering your account. Please try again.",
					type: "error",
				});
			}
		} finally {
			setPassword("");
			setPasswordConfirm("");
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
						onChangeText={setName}
						value={name}
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Enter your name"
						placeholderTextColor="#9ca3af"
					/>
				</View>

				{/* Phone */}
				<View className="gap-2">
					<Text className="text-sm font-medium text-gray-600">
						Phone number
					</Text>
					<TextInput
						onChangeText={setPhoneNumber}
						value={phoneNumber}
						textContentType="telephoneNumber"
						keyboardType="phone-pad"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Enter phone number"
						placeholderTextColor="#9ca3af"
					/>
				</View>

				{/* Password */}
				<View className="gap-2">
					<Text className="text-sm font-medium text-gray-600">Password</Text>
					<TextInput
						onChangeText={setPassword}
						value={password}
						secureTextEntry
						textContentType="newPassword"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Create password"
						placeholderTextColor="#9ca3af"
					/>
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
					<Text className="text-white font-bold text-lg text-center">
						Register
					</Text>
				</TouchableOpacity>

				{/* Footer */}
				<View className="flex-row justify-center gap-1 mt-2">
					<Text className="text-gray-600">Already have an account?</Text>
					<Link
						href="/(auth)/login"
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
