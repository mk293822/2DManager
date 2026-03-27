import { UseAuthInterface } from "@/hooks/auth/use-auth";
import { ManageHookType } from "@/hooks/manage/use-manage-hook";
import { SectionRange } from "@/types/manage-types";
import { createContext } from "react";

export const AuthContext = createContext<UseAuthInterface | undefined>(
	undefined,
);

// export const BussinessUserDetailsContext = createContext<
// 	| (BussinessUserDetailsHookType & {
// 			bussinessUserType: BussinessUserType;
// 			setBussinessUserType: React.Dispatch<
// 				React.SetStateAction<BussinessUserType>
// 			>;
// 	  })
// 	| undefined
// >(undefined);

export const ManageContext = createContext<
	| (ManageHookType & {
			selectedSectionRange: SectionRange;
			setSelectedSectionRange: React.Dispatch<
				React.SetStateAction<SectionRange>
			>;
	  })
	| undefined
>(undefined);
