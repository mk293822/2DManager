import { UseAuthInterface } from "@/hooks/use-auth";
import { useManageHookType } from "@/hooks/use-manage-hook";
import { createContext } from "react";

export const AuthContext = createContext<UseAuthInterface | undefined>(
	undefined,
);

export const ManagePageContext = createContext<useManageHookType | undefined>(
	undefined,
);
