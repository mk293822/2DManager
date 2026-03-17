// useCalculatedNumbersData.ts

import { changePlace } from "@/lib/helpers";
import {
	ensureEntry,
	generateNumbers,
	getCombinationsWithFixedNumber,
	getPATENumbers,
	getPaWaNumbers,
	getTAITNumbers,
	isAllSame,
} from "@/lib/two-d-list-helper";
import {
	FilterModeType,
	NumberEntry,
	NumberItem,
} from "@/types/two-d-list-types";
import { useMemo } from "react";

// ---------------- PRECOMPUTED LISTS ----------------

export const ALL_NUMBERS = generateNumbers(2);

const APU_NUMBERS = ALL_NUMBERS.filter((n) => isAllSame(n));
const SONE_PU_NUMBERS = ALL_NUMBERS.filter(
	(n) => isAllSame(n, "normal") && Number(n[0]) % 2 === 0,
);
const MA_PU_NUMBERS = ALL_NUMBERS.filter(
	(n) => isAllSame(n, "normal") && Number(n[0]) % 2 !== 0,
);

const PA_WA_NUMBERS = getPaWaNumbers();

export const NAK_KAT_NUMBERS = [
	"07",
	"18",
	"24",
	"35",
	"69",
	"70",
	"81",
	"42",
	"53",
	"96",
];

export const useCalculatedNumbersData = (
	numbers: NumberItem[] | null,
	filterMode: FilterModeType = "all",
	limit: number = 0,
	isFull: boolean = true,
): NumberEntry[] =>
	useMemo(() => {
		if (!numbers) return [];

		// 2️⃣ Group by number and compute total
		const numberMap: Record<string, NumberEntry> = {};

		for (const num of numbers) {
			// NORMAL
			if (num.type === "normal") {
				const entry = ensureEntry(numberMap, num.number);
				entry.items.push(num);
				entry.value += Number(num.amount1 || 0);

				if (num.amount2) {
					const n = changePlace(num.number);
					const entry = ensureEntry(numberMap, n);
					entry.items.push({ ...num, number: n });
					entry.value += Number(num.amount2 || 0);
				}
			}

			// DIGIT RELATED
			else if (num.type === "digit_related") {
				let numbers: string[] = [];
				const digit = Number(num.number.charAt(0));

				if (num.value === "OOK_SU") {
					numbers = getCombinationsWithFixedNumber(digit, 2);
				} else if (num.value === "TAIT") {
					numbers = getTAITNumbers(digit, 2);
				} else {
					numbers = getPATENumbers(digit, 2);
				}

				for (const n of numbers) {
					const entry = ensureEntry(numberMap, n);

					entry.items.push({
						...num,
						number: n,
					} as NumberItem);

					entry.value += Number(num.amount1 || 0);
				}
			}

			// SPECIAL GROUP
			else if (num.type === "special_group") {
				let numbers: string[] = [];

				if (num.value === "APU") numbers = APU_NUMBERS;
				else if (num.value === "SONE_PU") numbers = SONE_PU_NUMBERS;
				else if (num.value === "MA_PU") numbers = MA_PU_NUMBERS;
				else if (num.value === "PA_WA") numbers = PA_WA_NUMBERS;
				else numbers = NAK_KAT_NUMBERS;

				for (const n of numbers) {
					const entry = ensureEntry(numberMap, n);

					entry.items.push({
						...num,
						number: n,
					} as NumberItem);

					entry.value += Number(num.amount1 || 0);
				}
			}
		}

		// 3️⃣ Prepare full list 00–99 and apply filter
		const fullList: NumberEntry[] = [];

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

		if (!isFull) return fullList.filter((n) => n.value !== 0);

		return fullList;
	}, [numbers, filterMode, limit, isFull]);
