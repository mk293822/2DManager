import { UseAuthInterface } from "@/hooks/use-auth";
import { createContext } from "react";

export const AuthContext = createContext<UseAuthInterface | undefined>(
	undefined,
);
