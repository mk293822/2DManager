import React, { PropsWithChildren } from "react";
import { Modal, View } from "react-native";
import { Loading } from "../loading";

const AppModal = ({
	children,
	open = false,
	loading = false,
}: PropsWithChildren<{ open: boolean; loading?: boolean }>) => {
	return (
		<Modal
			visible={open}
			transparent
			animationType="fade"
		>
			<View
				className="flex-1 justify-center items-center p-4"
				style={{ backgroundColor: "rgba(17,24,39,0.5)" }}
			>
				<View className="bg-gray-100 w-1/2 h-40 flex-col rounded-2xl p-6 py-8 shadow-lg">
					<Loading />
				</View>
				{children}
			</View>
		</Modal>
	);
};

export default AppModal;
