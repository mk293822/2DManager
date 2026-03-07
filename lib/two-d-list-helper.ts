// ---------------- HELPERS ----------------

import { NumberEntry } from "@/types/two-d-list-types";

export const chunkIntoPairs = (data: any[]) => {
	const result = [];
	for (let i = 0; i < data.length; i += 2) {
		result.push({
			left: data[i],
			right: data[i + 1] || null,
		});
	}
	return result;
};

export function ensureEntry(
	map: Record<string, NumberEntry>,
	n: string,
): NumberEntry {
	if (!map[n]) {
		map[n] = { number: n, items: [], value: 0 };
	}
	return map[n];
}

const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function getCombinationsWithFixedNumber(
	fixed: number,
	length: number,
): string[] {
	const results: string[] = [];

	function build(current: number[], fixedPlaced: boolean, pos: number) {
		if (pos === length) {
			if (fixedPlaced) results.push(current.join(""));
			return;
		}

		if (!fixedPlaced) {
			build([...current, fixed], true, pos + 1);
		}

		for (const num of NUMBERS) {
			if (num === fixed) continue;
			build([...current, num], fixedPlaced, pos + 1);
		}
	}

	build([], false, 0);
	results.push(fixed.toString() + fixed.toString());

	return results;
}

export function getTAITNumbers(num: number, length: number = 2): string[] {
	const results: string[] = [];

	for (const n of NUMBERS) {
		results.push(num.toString() + n.toString());
	}

	return results;
}

export function getPATENumbers(num: number, length: number = 2): string[] {
	const results: string[] = [];

	for (const n of NUMBERS) {
		results.push(n.toString() + num.toString());
	}

	return results;
}

export function getPaWaNumbers(): string[] {
	const results = new Set<string>();

	for (const num of NUMBERS) {
		results.add(num.toString() + ((num + 5) % 10).toString());
	}

	return Array.from(results).sort();
}

export function generateNumbers(len: number): string[] {
	const results = new Set<string>();

	function build(current: number[], pos: number) {
		if (pos === len) {
			results.add(current.join(""));
			return;
		}

		for (const num of NUMBERS) {
			build([...current, num], pos + 1);
		}
	}

	build([], 0);

	return Array.from(results).sort();
}

export function isAllSame(
	str: string,
	type: "normal" | "even" | "odd" = "normal",
): boolean {
	const arr = str.split("").map(Number);

	switch (type) {
		case "normal":
			return arr.every((num) => num === arr[0]);

		case "even":
			return arr.every((num) => num % 2 === 0);

		case "odd":
			return arr.every((num) => num % 2 !== 0);

		default:
			return false;
	}
}
