import BussinessUserDetailsProvider from "@/contexts/bussiness-user-details-provider";
import TwoDListProvider from "@/contexts/two-d-list-context";
import { Stack } from "expo-router";

export default function BussinessLayout() {
	return (
		<BussinessUserDetailsProvider>
			<TwoDListProvider>
				<Stack screenOptions={{ headerShown: false }} />
			</TwoDListProvider>
		</BussinessUserDetailsProvider>
	);
}
