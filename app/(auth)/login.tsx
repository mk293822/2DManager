import InlineLoadingButton from "@/components/ui/inline-loading-button";
import { EVENT_NAMES } from "@/event-names";
import { LoginFields } from "@/hooks/auth/use-auth";
import { useAuthContext } from "@/hooks/auth/use-auth-context";
import { eventBus } from "@/lib/event-bus";
import { formatPhone } from "@/lib/helpers";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

const Login = () => {
	const { login, loggingIn } = useAuthContext();

	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");

	const [errors, setErrors] = useState<Partial<Record<LoginFields, string>>>(
		{},
	);

	const router = useRouter();

	const handleLogin = async () => {
		const res = await login({ phone_number: phoneNumber, password });

		if (!res.error) {
			setErrors({});

			setPhoneNumber("");
			setPassword("");

			router.replace("/profile");
			return;
		} else if (res.error.form && Object.keys(res.error.fields).length === 0) {
			eventBus.emit(EVENT_NAMES.NOTIFICATION, {
				type: "error",
				title: "Login Failed",
				description: res.error.form,
			});
		} else {
			setErrors(res.error.fields);
		}
	};

	const displayPhoneNumber = formatPhone(phoneNumber);

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
						value={displayPhoneNumber}
						onChangeText={(text) => {
							// keep only digits
							const digits = text.replace(/\D/g, "");
							setPhoneNumber(digits);
							if (errors.phone_number)
								setErrors((p) => ({ ...p, phone_number: undefined }));
						}}
						placeholder="09 123 456 789"
						keyboardType="phone-pad"
						textContentType="telephoneNumber"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
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
							if (errors.password)
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
				<InlineLoadingButton
					onPress={handleLogin}
					label="Login"
					loading={loggingIn}
				/>

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
