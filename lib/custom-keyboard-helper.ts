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
