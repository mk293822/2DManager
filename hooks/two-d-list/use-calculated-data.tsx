import { chunkIntoPairs } from "@/lib/helpers";
import {
	FilterModeType,
	SoldNumberItem,
	TwoDListGroup,
} from "@/types/two-d-list-types";
import { useMemo } from "react";

export const useCalculatedData = (
	selectedUserId: string,
	filterMode: FilterModeType,
	limit: number,
	twoDListGroup: TwoDListGroup | null,
) =>
	useMemo(() => {
		if (!twoDListGroup) return [];

		// 1️⃣ Collect all sold numbers for selected user
		const allNumbers: SoldNumberItem[] = Object.entries(
			twoDListGroup.sold_numbers_by_user,
		)
			.filter(([user]) => selectedUserId === "all" || user === selectedUserId)
			.flatMap(([, twoDListArray]) => twoDListArray)
			.flatMap((item) => item.numbers_data);

		// 2️⃣ Group by number and compute total at the same time
		const numberMap: Record<
			string,
			{ number: string; items: SoldNumberItem[]; value: number }
		> = {};

		for (const num of allNumbers) {
			if (!numberMap[num.number]) {
				numberMap[num.number] = { number: num.number, items: [], value: 0 };
			}
			numberMap[num.number].items.push(num);
			numberMap[num.number].value += Number(num.total_amount || 0);
		}

		// 3️⃣ Prepare full list 00–99 and apply filter
		const fullList = [];
		for (let i = 0; i < 100; i++) {
			const number = i.toString().padStart(2, "0");
			const entry = numberMap[number] || { number, items: [], value: 0 };

			if (
				filterMode === "all" ||
				(filterMode === "greater" && entry.value > limit) ||
				(filterMode === "less" && entry.value <= limit)
			) {
				fullList.push(entry);
			}
		}

		const chunks = chunkIntoPairs(fullList);
		return chunks;
	}, [twoDListGroup, selectedUserId, filterMode, limit]);
