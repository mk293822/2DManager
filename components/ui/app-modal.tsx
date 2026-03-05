import React, { PropsWithChildren } from "react";
import { Modal, View } from "react-native";

const AppModal = ({
	children,
	open = false,
}: PropsWithChildren<{ open: boolean }>) => {
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
				{children}
			</View>
		</Modal>
	);
};

export default AppModal;
