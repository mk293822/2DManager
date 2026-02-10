import { EVENT_NAMES } from "@/event-names";
import { useAuthContext } from "@/hooks/use-auth-context";
import { eventBus } from "@/lib/event-bus";
import { AxiosError, isCancel } from "axios";
import { Link } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Login = () => {
	const { login } = useAuthContext();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		try {
			await login(phoneNumber, password);
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Login Success",
				description: "You successfully login to your account!",
				type: "success",
			});

			setPhoneNumber("");
			navigate("/profile");
		} catch (err) {
			if (isCancel(err)) return;
			if (err instanceof AxiosError) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					title: err.response?.data?.message || err.message || "Login failed",
					description:
						"There was a problem logging into your account. Please try again.",
					type: "error",
				});
			} else {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					title: "Login failed ",
					description:
						"There was a problem logging into your account. Please try again.",
					type: "error",
				});
			}
		} finally {
			setPassword("");
		}
	};

	return (
		<View className="flex-1 bg-gray-100 justify-center px-6">
			<View className="bg-white rounded-2xl p-6 gap-5 shadow-sm">
				{/* Title */}
				<View className="gap-1">
					<Text className="text-2xl font-bold">Welcome back</Text>
					<Text className="text-gray-500 text-sm">Login to continue</Text>
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
						secureTextEntry
						onChangeText={setPassword}
						value={password}
						textContentType="password"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Enter password"
						placeholderTextColor="#9ca3af"
					/>
				</View>

				{/* Login Button */}
				<TouchableOpacity
					onPress={handleLogin}
					activeOpacity={0.85}
					className="bg-indigo-400 py-3 rounded-lg mt-2"
				>
					<Text className="text-white font-bold text-lg text-center">
						Login
					</Text>
				</TouchableOpacity>

				{/* Footer */}
				<View className="flex-row justify-center gap-1 mt-2">
					<Text className="text-gray-600">Don’t have an account?</Text>
					<Link
						href="/(auth)/register"
						className="text-indigo-500 font-semibold"
					>
						Register
					</Link>
				</View>
			</View>
		</View>
	);
};

export default Login;
