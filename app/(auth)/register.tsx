import { Link } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Register = () => {
	return (
		<View className="flex-1 bg-gray-100 justify-center px-6">
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
						secureTextEntry
						textContentType="password"
						className="bg-gray-100 rounded-lg px-4 py-3 text-base"
						placeholder="Confirm password"
						placeholderTextColor="#9ca3af"
					/>
				</View>

				{/* Register Button */}
				<TouchableOpacity
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
		</View>
	);
};

export default Register;
