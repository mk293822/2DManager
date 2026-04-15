import {
	ParseResult,
	SpecialGroupValue1,
	SpecialGroupValue2,
} from "@/types/two-d-list-types";

export const BURMESE_KEYS_MAP = {
	အပူး: "APU",
	စုံပူး: "SONE_PU",
	"'မ'ပူး": "MA_PU",
	အုပ်စု: "OOK_SU",
	ထိပ်: "TAIT",
	ပါဝါ: "PA_WA",
	ပိတ်: "PATE",
	နက္ခက်: "NAK_KET",
} as const;

export const SPECIAL_KEYS1 = ["APU", "SONE_PU", "MA_PU", "PA_WA", "NAK_KET"];
export const SPECIAL_KEYS2 = ["OOK_SU", "TAIT", "PATE"];
export const ENGLISH_TO_BURMESE_MAP: Record<string, string> =
	Object.fromEntries(
		Object.entries(BURMESE_KEYS_MAP).map(([mm, en]) => [en, mm]),
	);

export function sanitizeTwoD(value: string) {
	// allow only numbers or known mapped keys
	const cleaned = value.trim();

	// if it's a mapped Burmese key, keep it
	if (ENGLISH_TO_BURMESE_MAP[cleaned]) return cleaned;

	// allow only digits for numeric input
	if (/^\d+$/.test(cleaned)) return cleaned;

	return "";
}

export function sanitizeAmount(value: string) {
	const cleaned = value.replace(/,/g, "").trim();

	const onlyNumbers = cleaned.replace(/[^\d]/g, "");

	return onlyNumbers;
}

export const isSpecialGroupValue1 = (
	val: string,
): val is SpecialGroupValue1 => {
	return (SPECIAL_KEYS1 as readonly string[]).includes(val);
};

export const isSpecialGroupValue2 = (
	val: string,
): val is SpecialGroupValue2 => {
	return (SPECIAL_KEYS2 as readonly string[]).includes(val);
};

export function parseTwoDLine(raw: string): ParseResult {
	if (raw.trim() === "") {
		return { ok: true, data: null };
	}

	const [leftRaw, ...rest] = raw.split("=");

	if (!leftRaw || rest.length === 0) {
		return { ok: false, error: "Missing '=' separator" };
	}

	const left = leftRaw.trim();
	const rightRaw = rest.join("=").trim();

	const isValidAmount = (val: string) => /^\d+$/.test(val) && Number(val) >= 1;

	// -------------------------
	// CASE 1: Special Group
	// -------------------------
	if (left in BURMESE_KEYS_MAP) {
		const mapped = BURMESE_KEYS_MAP[left as keyof typeof BURMESE_KEYS_MAP];

		if (!isSpecialGroupValue1(mapped)) {
			return { ok: false, error: "Invalid special group type" };
		}

		if (!isValidAmount(rightRaw)) {
			return { ok: false, error: "Amount must be a number ≥ 1" };
		}

		return {
			ok: true,
			data: {
				type: "special_group",
				value: mapped,
				amount1: Number(rightRaw),
			},
		};
	}

	// -------------------------
	// CASE 2: Digit Related
	// -------------------------
	const match = left.match(/^(\d)(\D+)$/);

	if (match) {
		const digit = match[1];
		const burmese = match[2];

		if (!(burmese in BURMESE_KEYS_MAP)) {
			return { ok: false, error: "Unknown Burmese key" };
		}

		const mapped = BURMESE_KEYS_MAP[burmese as keyof typeof BURMESE_KEYS_MAP];

		if (!isSpecialGroupValue2(mapped)) {
			return { ok: false, error: "Invalid digit-related group" };
		}

		if (!isValidAmount(rightRaw)) {
			return { ok: false, error: "Amount must be ≥ 1" };
		}

		return {
			ok: true,
			data: {
				type: "digit_related",
				number: digit,
				value: mapped,
				amount1: Number(rightRaw),
			},
		};
	}

	// -------------------------
	// CASE 3: Normal (2 digits)
	// -------------------------
	if (!/^\d{2}$/.test(left)) {
		return { ok: false, error: "Number must be exactly 2 digits" };
	}

	let amount1 = 0;
	let amount2: number | undefined;

	if (rightRaw.includes("/")) {
		const [a, b] = rightRaw.split("/");

		if (!isValidAmount(a) || !isValidAmount(b)) {
			return { ok: false, error: "Amounts must be ≥ 1" };
		}

		amount1 = Number(a);
		amount2 = Number(b);
	} else if (rightRaw.includes("=")) {
		const [a, b] = rightRaw.split("=");

		if (!isValidAmount(a) || !isValidAmount(b)) {
			return { ok: false, error: "Amounts must be ≥ 1" };
		}

		amount1 = Number(a);
		amount2 = Number(b);
	} else {
		if (!isValidAmount(rightRaw)) {
			return { ok: false, error: "Amount must be ≥ 1" };
		}

		amount1 = Number(rightRaw);
	}

	return {
		ok: true,
		data: {
			type: "normal",
			number: left,
			amount1,
			...(amount2 !== undefined ? { amount2 } : {}),
		},
	};
}
