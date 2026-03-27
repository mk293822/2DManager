import { useAuth } from "@/hooks/auth/use-auth";
import React from "react";
import { AuthContext } from "./contexts";

export function AuthContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const data = useAuth();

	return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
