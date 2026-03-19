import { BussinessUserDetailsHookType } from "@/hooks/bussiness-user-details/use-user-details-hook";
import { BussinessUserHookType } from "@/hooks/bussiness-users/use-bussiness-user-hook";
import { ManageHookType } from "@/hooks/manage/use-manage-hook";
import { TwoDListHookType } from "@/hooks/two-d-list/use-two-d-list-hook";
import { UseAuthInterface } from "@/hooks/use-auth";
import { BussinessUserType } from "@/types/bussiness-user-types";
import { NumberType } from "@/types/two-d-list-types";
import { createContext } from "react";

export const AuthContext = createContext<UseAuthInterface | undefined>(
	undefined,
);

export const TwoDListContext = createContext<
	| (TwoDListHookType & {
			numberType: NumberType;
			setNumberType: React.Dispatch<React.SetStateAction<NumberType>>;
	  })
	| undefined
>(undefined);

export const BussinessUserContext = createContext<
	| (BussinessUserHookType & {
			bussinessUserType: BussinessUserType;
			setBussinessUserType: React.Dispatch<
				React.SetStateAction<BussinessUserType>
			>;
	  })
	| undefined
>(undefined);

export const BussinessUserDetailsContext = createContext<
	BussinessUserDetailsHookType | undefined
>(undefined);

export const ManageContext = createContext<ManageHookType | undefined>(
	undefined,
);
