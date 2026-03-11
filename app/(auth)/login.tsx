import { EVENT_NAMES } from "@/event-names";
import { LoginFields } from "@/hooks/use-auth";
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

const Login = () => {
	const { login } = useAuthContext();

	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const [errors, setErrors] = useState<Partial<Record<LoginFields, string>>>(
		{},
	);

	const router = useRouter();

	const handleLogin = async () => {
		setLoading(true);

		const res = await login(phoneNumber, password);

		setLoading(false);

		if (res.success) {
			setErrors({});

			setPhoneNumber("");
			setPassword("");

			router.replace("/profile");
			return;
		}

		// field errors
		setErrors(res.errors.fields);

		// global error
		if (res.errors.form) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				title: "Login failed",
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
					<Text className="text-2xl font-bold">Welcome back</Text>
					<Text className="text-gray-500 text-sm">Login to continue</Text>
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
						keyboardType="phone-pad"
						textContentType="telephoneNumber"
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
						secureTextEntry
						onChangeText={(v) => {
							setPassword(v);
							setErrors((p) => ({ ...p, password: undefined }));
						}}
						value={password}
						textContentType="password"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Enter password"
						placeholderTextColor="#9ca3af"
					/>

					{errors.password && (
						<Text className="text-red-500 text-sm">{errors.password}</Text>
					)}
				</View>

				{/* Login Button */}
				<TouchableOpacity
					onPress={handleLogin}
					disabled={loading}
					activeOpacity={0.85}
					className="bg-indigo-400 py-3 rounded-lg mt-2"
				>
					{loading ? (
						<View className="items-center justify-center">
							<ActivityIndicator
								size={20}
								color="#fff"
							/>
						</View>
					) : (
						<Text className="text-white font-bold text-lg text-center">
							Login
						</Text>
					)}
				</TouchableOpacity>

				{/* Footer */}
				<View className="flex-row justify-center gap-1 mt-2">
					<Text className="text-gray-600">Don’t have an account?</Text>

					<Link
						href="/register"
						className="text-indigo-500 font-semibold"
					>
						Register
					</Link>
				</View>
			</View>
		</ScrollView>
	);
};

export default Login;
