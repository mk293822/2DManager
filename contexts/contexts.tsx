import { ComUserDetailsHookTypes } from "@/hooks/commission-user-details/use-commission-user-details-hook";
import { CommissionUserHookType } from "@/hooks/commission-users/use-commission-user-hook";
import { ManageHookType } from "@/hooks/manage/use-manage-hook";
import { TwoDListHookType } from "@/hooks/two-d-list/use-two-d-list-hook";
import { UseAuthInterface } from "@/hooks/use-auth";
import { createContext } from "react";

export const AuthContext = createContext<UseAuthInterface | undefined>(
	undefined,
);

export const TwoDListContext = createContext<TwoDListHookType | undefined>(
	undefined,
);

export const CommissionUserContext = createContext<
	CommissionUserHookType | undefined
>(undefined);

export const CommissionUserDetailsContext = createContext<
	ComUserDetailsHookTypes | undefined
>(undefined);

export const ManageContext = createContext<ManageHookType | undefined>(
	undefined,
);
