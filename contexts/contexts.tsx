import { UseAuthInterface } from "@/hooks/use-auth";
import { UseCommissionUserHookType } from "@/hooks/use-commission-user-hook";
import { UseManageHookType } from "@/hooks/use-manage-hook";
import { createContext } from "react";

export const AuthContext = createContext<UseAuthInterface | undefined>(
	undefined,
);

export const ManagePageContext = createContext<UseManageHookType | undefined>(
	undefined,
);

export const CommissoinUserDataContext = createContext<
	UseCommissionUserHookType | undefined
>(undefined);
