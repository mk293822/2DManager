import { User } from "./main";

export type CommissionUserType = {
	id: string;
	name: string;
	phone_number: string;
	manager: User;
};
