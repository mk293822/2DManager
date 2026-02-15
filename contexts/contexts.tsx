import { UseManageHookType } from "@/hooks/manage/use-manage-hook";
import { UseAuthInterface } from "@/hooks/use-auth";
import { UseCommissionUserHookType } from "@/hooks/use-commission-user-hook";
import { RangeMode } from "@/types/event-bus";
import { createContext } from "react";

export const AuthContext = createContext<UseAuthInterface | undefined>(
	undefined,
);

export const ManagePageDataContext = createContext<
	UseManageHookType | undefined
>(undefined);

export const ManagePageToggleContext = createContext<
	| {
			rangeMode: RangeMode;
			setRangeMode: React.Dispatch<React.SetStateAction<RangeMode>>;
	  }
	| undefined
>(undefined);

export const CommissoinUserDataContext = createContext<
	UseCommissionUserHookType | undefined
>(undefined);
