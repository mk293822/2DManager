import { UseCommissionUserHookType } from "@/hooks/commission-users/use-commission-user-hook";
import { UseAuthInterface } from "@/hooks/use-auth";
import { RangeMode } from "@/types/manage-types";
import { createContext } from "react";

export const AuthContext = createContext<UseAuthInterface | undefined>(
	undefined,
);

export const CommissoinUserHeaderContext = createContext<
	UseCommissionUserHookType | undefined
>(undefined);

export const CommissoinUserDetailsHeaderContext =
	createContext<undefined>(undefined);

export const ToggleContext = createContext<
	| {
			rangeMode: RangeMode;
			setRangeMode: React.Dispatch<React.SetStateAction<RangeMode>>;
	  }
	| undefined
>(undefined);
