import { parseTwoDLine } from "@/lib/custom-keyboard-helper";
import { PreviewDataType } from "@/types/two-d-list-types";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import AppModal from "../ui/app-modal";

type Props = {
	pastePreviewOpen: boolean;
	previewData: PreviewDataType | null;
	setPreviewData: React.Dispatch<React.SetStateAction<PreviewDataType | null>>;
	setPastePreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
	confirmPaste: () => void;
};

const InvaildLinePasteModal = ({
	pastePreviewOpen,
	previewData,
	setPreviewData,
	setPastePreviewOpen,
	confirmPaste,
}: Props) => {
	const disabledConfirm = previewData?.lines.some((line) => {
		const result = parseTwoDLine(line.raw);

		return !result.ok;
	});

	return (
		<AppModal open={pastePreviewOpen}>
			<View className="bg-white w-full rounded-2xl p-4 max-h-[80%]">
				<Text className="text-indigo-600 text-xl font-bold mb-3">
					Paste Preview
				</Text>

				{previewData?.lines.map((line, index) => {
					const result = parseTwoDLine(line.raw);
					const isValid = result.ok;

					return (
						<View
							key={line.id}
							className="mb-3"
						>
							<TextInput
								value={line.raw}
								onChangeText={(text) => {
									setPreviewData((prev) => {
										if (!prev) return prev;

										const updated = [...prev.lines];

										updated[index] = {
											...updated[index],
											raw: text,
										};

										return { lines: updated };
									});
								}}
								className={`border p-3 rounded-lg ${
									isValid
										? result.data
											? "border-indigo-300"
											: "border-gray-300"
										: "border-red-400"
								}`}
							/>

							{/* 🔥 REAL ERROR MESSAGE */}
							{!isValid && (
								<Text className="text-red-500 text-xs mt-1">
									{result.error}
								</Text>
							)}

							{/* VALID */}
							{isValid && (
								<Text
									className={`${result.data ? "text-green-600" : "text-gray-500"} text-xs mt-1`}
								>
									{result.data ? "Valid ✔" : "Empty Line (will be ignored)"}
								</Text>
							)}
						</View>
					);
				})}

				{/* BUTTONS */}
				<View className="flex-row gap-3 mt-5">
					<TouchableOpacity
						onPress={() => {
							setPastePreviewOpen(false);
							setPreviewData(null);
						}}
						className="flex-1 bg-gray-200 py-3 rounded-xl"
					>
						<Text className="text-center font-bold">Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={confirmPaste}
						className="disabled:opacity-60 flex-1 bg-indigo-600 py-3 rounded-xl"
						disabled={disabledConfirm}
					>
						<Text className="text-center text-white font-bold">Confirm</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AppModal>
	);
};

export default InvaildLinePasteModal;
