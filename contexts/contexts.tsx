import { ComUserDetailsHookTypes } from "@/hooks/commission-user-details/use-commission-user-details-hook";
import { UseCommissionUserHookType } from "@/hooks/commission-users/use-commission-user-hook";
import { UseManageHookType } from "@/hooks/manage/use-manage-hook";
import { UseAuthInterface } from "@/hooks/use-auth";
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

export const CommissoinUserPageContext = createContext<
	UseCommissionUserHookType | undefined
>(undefined);

export const CommissoinUserHeaderContext = createContext<
	| {
			handleCreateCommissionUser: (payload: {
				name: string;
				phone_number: string;
			}) => Promise<void>;
	  }
	| undefined
>(undefined);

export const CommissionUserDetailsContext = createContext<
	ComUserDetailsHookTypes | undefined
>(undefined);
