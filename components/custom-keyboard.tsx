// CustomKeyboard.tsx
import { EVENT_NAMES } from "@/event-names";
import {
	BURMESE_KEYS_MAP,
	ENGLISH_TO_BURMESE_MAP,
	sanitizeAmount,
	sanitizeTwoD,
	SPECIAL_KEYS1,
	SPECIAL_KEYS2,
} from "@/lib/custom-keyboard-helper";
import { eventBus } from "@/lib/event-bus";
import { isNumber } from "@/lib/helpers";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface CustomKeyboardProps {
	twoDValue: string;
	amount1Value: string;
	amount2Value: string;
	setTwoDValue: React.Dispatch<React.SetStateAction<string>>;
	setAmount1Value: React.Dispatch<React.SetStateAction<string>>;
	setAmount2Value: React.Dispatch<React.SetStateAction<string>>;
	onEnter: () => void; // Optional Enter callback
}

const KEYBOARD_HEIGHT = 300;
const FIELD_HEIGHT = 65;

type ActiveField = "twoD" | "amount1" | "amount2";

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
	twoDValue,
	amount1Value,
	amount2Value,
	setTwoDValue,
	setAmount1Value,
	setAmount2Value,
	onEnter,
}) => {
	const [activeField, setActiveField] = useState<ActiveField>("twoD");

	// Refs
	const twoDRef = useRef<TextInput>(null);
	const amount1Ref = useRef<TextInput>(null);
	const amount2Ref = useRef<TextInput>(null);
	const [isR, setIsR] = useState<boolean>(false);

	// Key rows
	const topRow = useMemo(() => ["အပူး", "အုပ်စု", "ထိပ်", "ပိတ်"], []);
	const secondRow = useMemo(() => ["စုံပူး", "1", "2", "3"], []);
	const numericRows = useMemo(
		() => [
			["'မ'ပူး", "7", "8", "9"],
			["ပါဝါ", "4", "5", "6"],
			["နက္ခက်", "0", "00", "000"],
		],
		[],
	);

	// Play haptic feedback
	const playTap = useCallback(
		async (keyType: "normal" | "delete" | "enter" = "normal") => {
			try {
				await Promise.all([
					keyType === "delete"
						? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
						: keyType === "enter"
							? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
							: Haptics.selectionAsync(),
				]);
			} catch (e) {
				eventBus.emit(EVENT_NAMES.NOTIFICATION, {
					type: "error",
					title: "Tap Error",
					description: JSON.stringify(e),
				});
			}
		},
		[],
	);

	// Handle key press
	const handlePress = useCallback(
		(inputValue: string) => {
			playTap("normal");

			const value =
				BURMESE_KEYS_MAP[inputValue as keyof typeof BURMESE_KEYS_MAP] ??
				inputValue;

			if (SPECIAL_KEYS1.includes(value)) {
				setTwoDValue(value);
				setIsR(false);
				setActiveField("amount1");
				amount1Ref.current?.focus();
				setAmount2Value("");
				setAmount1Value("");
				return;
			}

			if (SPECIAL_KEYS2.includes(value)) {
				setAmount1Value(value);
				setIsR(false);
				setTwoDValue((pre) => (isNumber(pre) ? pre.charAt(0) : ""));
				if (!twoDValue) {
					setActiveField("twoD");
					twoDRef.current?.focus();
				} else {
					setActiveField("amount2");
					amount2Ref.current?.focus();
				}
				return;
			}

			// Numeric keys follow activeField
			if (activeField === "twoD") {
				// Only allow two digits & validate previous state
				if (amount1Value && !isNumber(amount1Value)) {
					setTwoDValue(value.charAt(0));
				} else if (twoDValue.length < 2) {
					setTwoDValue((prev) => prev + value.charAt(0));
				}
				return;
			}

			if (isR) {
				setAmount1Value((prev) => (isNumber(prev) ? prev + value : value));
				setAmount2Value((prev) => prev + value);
				return;
			}

			if (activeField === "amount1") {
				setAmount1Value((prev) => (isNumber(prev) ? prev + value : value));
				return;
			}

			// Default/fallback: update amount2
			setAmount2Value((prev) => prev + value);
		},
		[
			activeField,
			setTwoDValue,
			setAmount1Value,
			setAmount2Value,
			playTap,
			twoDValue,
			amount1Value,
			isR,
		],
	);

	// Handle delete key
	const handleDelete = useCallback(() => {
		playTap("delete");
		if (activeField === "twoD")
			setTwoDValue((prev) => (isNumber(prev) ? prev.slice(0, -1) : ""));
		else if (isR) {
			setAmount1Value((prev) => prev.slice(0, -1));
			setAmount2Value((prev) => prev.slice(0, -1));
		} else if (activeField === "amount1")
			setAmount1Value((prev) => (isNumber(prev) ? prev.slice(0, -1) : ""));
		else setAmount2Value((prev) => prev.slice(0, -1));
	}, [
		activeField,
		setTwoDValue,
		setAmount1Value,
		setAmount2Value,
		playTap,
		isR,
	]);

	const handleFieldPress = (
		field: ActiveField,
		ref: React.RefObject<TextInput | null>,
	) => {
		setActiveField(field);
		ref.current?.focus();
	};

	return (
		<View
			style={{ height: KEYBOARD_HEIGHT }}
			className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 p-4"
		>
			{/* Input fields */}
			<View
				className="absolute left-0 right-0 bg-gray-50 border-t border-gray-300 px-4 py-2 flex-row justify-between"
				style={{
					bottom: KEYBOARD_HEIGHT,
					height: FIELD_HEIGHT,
					backgroundColor: "white",
					shadowColor: "#000",
					shadowOffset: { width: 0, height: -4 },
					shadowOpacity: 0.25,
					shadowRadius: 4,
					elevation: 1,
				}}
			>
				{/* Two-D Field */}
				<View className="flex-1 mr-2 p-1 rounded-lg">
					<TextInput
						ref={twoDRef}
						placeholder="Two-D"
						value={ENGLISH_TO_BURMESE_MAP[twoDValue] ?? twoDValue}
						onChangeText={(text) => {
							const clean = sanitizeTwoD(text);
							setTwoDValue(clean);
						}}
						editable
						onPressIn={() => handleFieldPress("twoD", twoDRef)}
						showSoftInputOnFocus={false}
						placeholderTextColor={"#9ca3af"}
						className="bg-white shadow text-gray-900 shadow-black rounded-lg px-4 py-3 border border-gray-200 focus:border-indigo-600"
						accessibilityLabel="Two-D Field"
						accessibilityState={{ selected: activeField === "twoD" }}
					/>
				</View>

				{/* Amount 1 */}
				<View className="flex-1 mr-2 p-1 rounded-lg">
					<TextInput
						ref={amount1Ref}
						placeholder="Amount 1"
						value={
							amount1Value && isNumber(amount1Value)
								? Number(amount1Value).toLocaleString()
								: (ENGLISH_TO_BURMESE_MAP[amount1Value] ?? amount1Value)
						}
						placeholderTextColor={"#9ca3af"}
						onChangeText={(text) => {
							const clean = sanitizeAmount(text);
							setAmount1Value(clean);
						}}
						editable
						onPressIn={() => handleFieldPress("amount1", amount1Ref)}
						showSoftInputOnFocus={false}
						className="bg-white shadow text-gray-900 shadow-black rounded-lg px-4 py-3 border border-gray-200 focus:border-indigo-600"
						accessibilityLabel="Amount 1 Field"
						accessibilityState={{ selected: activeField === "amount1" }}
					/>
				</View>

				{/* Amount 2 */}
				<View className="flex-1 mr-2 p-1 rounded-lg">
					<TextInput
						ref={amount2Ref}
						placeholder="Amount 2"
						value={
							amount2Value && isNumber(amount2Value)
								? Number(amount2Value).toLocaleString()
								: amount2Value
						}
						placeholderTextColor={"#9ca3af"}
						onChangeText={(text) => {
							const clean = sanitizeAmount(text);
							setAmount2Value(clean);
						}}
						editable={!SPECIAL_KEYS1.includes(twoDValue)}
						onPressIn={() => handleFieldPress("amount2", amount2Ref)}
						showSoftInputOnFocus={false}
						className={`bg-white shadow text-gray-900 shadow-black rounded-lg px-4 py-3 border border-gray-200 focus:border-indigo-600 ${SPECIAL_KEYS1.includes(twoDValue) ? "border-red-600" : ""}`}
						accessibilityLabel="Amount 2 Field"
						accessibilityState={{ selected: activeField === "amount2" }}
					/>
				</View>
			</View>

			{/* Top & second rows */}
			<View className="flex-row mb-2">
				{topRow.map((key) => (
					<Pressable
						key={key}
						onPress={() => handlePress(key)}
						className={
							"flex-1  border border-gray-200 mx-1 shadow-gray-800 shadow-lg py-3 rounded-lg items-center bg-white disabled:bg-gray-400"
						}
						disabled={SPECIAL_KEYS1.includes(twoDValue) && key !== "အပူး"}
						accessibilityRole="button"
						accessibilityLabel={key}
						accessibilityHint={`Inserts ${key}`}
					>
						<Text className={"text-indigo-600 font-bold text-lg"}>{key}</Text>
					</Pressable>
				))}
				{/* R */}
				<Pressable
					onPress={() => {
						setIsR((pre) => !pre);
						if (amount1Value !== amount2Value) {
							setAmount1Value("");
							setAmount2Value("");
						}
					}}
					disabled={SPECIAL_KEYS1.includes(twoDValue)}
					className={`flex-1  border border-gray-200 mx-1 shadow-gray-800 shadow-lg py-3 rounded-lg items-center disabled:bg-gray-400 ${isR ? "bg-indigo-600" : "bg-white"}`}
					accessibilityRole="button"
					accessibilityLabel={"R"}
					accessibilityHint={"R"}
				>
					<Text
						className={`font-bold text-lg ${isR ? "text-white" : "text-indigo-600"}`}
					>
						R
					</Text>
				</Pressable>
			</View>
			<View className="flex-row mb-2">
				{secondRow.map((key) => (
					<Pressable
						key={key}
						onPress={() => handlePress(key)}
						className={
							"flex-1  border border-gray-200 mx-1 shadow-gray-800 shadow-lg py-3 rounded-lg items-center bg-white"
						}
						accessibilityRole="button"
						accessibilityLabel={key}
						accessibilityHint={`Inserts ${key}`}
					>
						<Text className={"text-indigo-600 font-bold text-lg"}>{key}</Text>
					</Pressable>
				))}
				<Pressable
					onPress={handleDelete}
					className={
						"flex-1  border border-gray-200 mx-1 shadow-gray-800 shadow-lg py-3 rounded-lg items-center bg-red-600"
					}
					accessibilityRole="button"
					accessibilityLabel={"Delete"}
					accessibilityHint={"Deletes one character"}
				>
					<Text className={"text-white font-bold text-lg"}>⌫</Text>
				</Pressable>
			</View>

			{/* Numeric rows */}
			<View className="flex-row">
				<View className="flex-col w-[80%]">
					{numericRows.map((row, rowIndex) => (
						<View
							key={rowIndex}
							className={`flex-row ${rowIndex === numericRows.length - 1 ? "" : "mb-2"}`}
						>
							{row.map((key) => (
								<Pressable
									key={key}
									onPress={() => handlePress(key)}
									accessibilityRole="button"
									accessibilityLabel={key}
									accessibilityHint={`Inserts ${key}`}
									className="flex-1 mx-1 border border-gray-200 shadow-gray-800 shadow-lg bg-white py-3 rounded-lg items-center"
								>
									<Text className="text-indigo-600 font-bold text-lg">
										{key}
									</Text>
								</Pressable>
							))}
						</View>
					))}
				</View>

				{/* Enter button */}
				<Pressable
					className="flex-1 mx-1 border border-gray-200 shadow-gray-800 shadow-lg bg-indigo-600 py-3 rounded-lg items-center justify-center"
					onPress={() => {
						playTap("enter");
						onEnter();
					}}
					accessibilityRole="button"
					accessibilityLabel="Enter"
					accessibilityHint="Submits input or triggers primary action"
				>
					<Text className="text-white font-bold text-md text-center">
						Enter
					</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default CustomKeyboard;
