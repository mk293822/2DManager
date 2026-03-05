import { FilterModeType } from "@/types/two-d-list-types";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type TwodListToolBarProps = {
	filterMode: FilterModeType;
	filterDropdownOpen: boolean;
	userDropdownOpen: boolean;
	selectedUserId: string;
	inputValue: number;
	users: {
		id: string;
		name: string;
	}[];

	setInputValue: React.Dispatch<React.SetStateAction<number>>;
	setSelectedUserId: React.Dispatch<React.SetStateAction<string>>;
	setFilterDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setUserDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setFilterMode: React.Dispatch<React.SetStateAction<FilterModeType>>;
};

const TwoDListToolBar = ({
	filterMode,
	users,
	selectedUserId,
	setSelectedUserId,
	setFilterDropdownOpen,
	filterDropdownOpen,
	setUserDropdownOpen,
	userDropdownOpen,
	setFilterMode,
	inputValue,
	setInputValue,
}: TwodListToolBarProps) => {
	return (
		<View className="flex-row justify-between items-center px-4 pt-3 pb-4 gap-2">
			<View className="flex-row gap-2 flex-1">
				{/* Filter button */}
				<View className="flex-1 relative">
					<TouchableOpacity
						className="flex-1 py-3 bg-indigo-800/70 rounded-full items-center"
						onPress={() => setFilterDropdownOpen(!filterDropdownOpen)}
					>
						<Text
							className="text-white font-semibold text-sm capitalize"
							numberOfLines={1} // single line
						>
							{filterMode === "greater"
								? "Greater"
								: filterMode === "less"
									? "Less"
									: "All"}{" "}
							▼
						</Text>
					</TouchableOpacity>

					{/* Filter dropdown */}
					{filterDropdownOpen && (
						<View
							className="absolute top-12 left-0 p-2 z-50"
							style={{
								backgroundColor: "#a5b4fc", // strong indigo
								minWidth: 140,
								borderRadius: 12,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 5,
							}}
						>
							{["all", "greater", "less"].map((mode) => (
								<TouchableOpacity
									key={mode}
									className="py-2 px-3 rounded-md mb-1"
									style={{ backgroundColor: "rgb(55 48 163 / 0.6)" }} // lighter indigo
									onPress={() => {
										setFilterMode(mode as FilterModeType);
										setFilterDropdownOpen(false);
									}}
								>
									<Text
										className="text-white font-semibold capitalize"
										numberOfLines={1}
									>
										{mode === "greater"
											? "Greater"
											: mode === "less"
												? "Less"
												: "All"}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					)}
				</View>

				{/* Limit input */}
				<View className="w-[130px] bg-indigo-800/70 rounded-full items-center flex-row justify-center gap-1 pl-3">
					<Text className="text-white font-semibold text-sm">Limit:</Text>
					<TextInput
						className="flex-1 text-center text-white bg-indigo-900/70 rounded-full font-semibold text-sm"
						value={inputValue.toLocaleString()}
						onChangeText={(text) => {
							const clean = text.replace(/,/g, "");
							setInputValue(Number(clean) || 0);
						}}
						keyboardType="numeric"
						placeholder="1000"
						placeholderTextColor="rgba(255,255,255,0.5)"
						returnKeyType="done"
						numberOfLines={1}
					/>
				</View>
			</View>

			{/* User button */}
			<View className="relative min-w-[140px]">
				<TouchableOpacity
					className="p-3 bg-indigo-800/70 rounded-full items-center"
					onPress={() => setUserDropdownOpen(!userDropdownOpen)}
				>
					<Text
						className="text-white font-semibold text-sm"
						numberOfLines={1}
					>
						{users.find((u) => u.id === selectedUserId)?.name || "All Users"}▼
					</Text>
				</TouchableOpacity>

				{/* User dropdown */}
				{userDropdownOpen && (
					<View
						className="absolute top-12 right-0 p-2 z-50"
						style={{
							backgroundColor: "#a5b4fc", // strong indigo
							minWidth: 160,
							borderRadius: 12,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 4 },
							shadowOpacity: 0.25,
							shadowRadius: 4,
							elevation: 5,
						}}
					>
						{users.map((user) => (
							<TouchableOpacity
								key={user.id}
								className="py-2 px-3 rounded-md mb-1"
								style={{ backgroundColor: "rgb(55 48 163 / 0.6)" }} // lighter indigo
								onPress={() => {
									setSelectedUserId(user.id);
									setUserDropdownOpen(false);
								}}
							>
								<Text
									className="text-white font-semibold"
									numberOfLines={1}
								>
									{user.name}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				)}
			</View>
		</View>
	);
};

export default TwoDListToolBar;
