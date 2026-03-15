import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const useInternet = () => {
	const [isConnected, setIsConnected] = useState<boolean | null>(null);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setIsConnected(state.isConnected && state.isInternetReachable);
		});

		return unsubscribe;
	}, []);

	return isConnected;
};
