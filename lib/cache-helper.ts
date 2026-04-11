import { getCache, updateCache } from "@/hooks/use-cache";
import { Model } from "@/types/event-bus";
import { SectionRange } from "@/types/manage-types";
import { formatDateRequest, getWeekRangeFromDate } from "./datetime-helper";

type KeyParams = Record<string, string | number | boolean | undefined>;

/**
 * Creates a stable cache key from a base string and params object.
 * Example:
 *   createKey('bussiness-user', { type: 'commission_user', id: 123 })
 *   -> "bussiness-user:type=commission_user:id=123"
 */
export function createKey(base: string, params?: KeyParams): string {
	if (!params) return base;

	const paramString = Object.entries(params)
		.filter(([_, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${value}`)
		.join(":");

	return paramString ? `${base}:${paramString}` : base;
}

export function getParamsForSectionRange(range: SectionRange) {
	return range.type === "day"
		? {
				type: "day",
				start_date: formatDateRequest(range.date),
				end_date: formatDateRequest(range.date),
			}
		: {
				type: "week",
				start_date: formatDateRequest(range.start_date),
				end_date: formatDateRequest(range.end_date),
			};
}

export function getKeyForSectionRange(range: SectionRange) {
	return range.type === "day"
		? { type: "day", date: formatDateRequest(range.date) }
		: {
				type: "week",
				start_date: formatDateRequest(range.start_date),
				end_date: formatDateRequest(range.end_date),
			};
}

export const getDayKeyFromDate = (
	model: string,
	date: string,
	keyParams?: Record<string, string>,
) =>
	createKey(model, {
		type: "day",
		date,
		...keyParams,
	});

export const getWeekKeyFromDate = (
	model: string,
	date: string,
	keyParams?: Record<string, string>,
) => {
	const { start, end } = getWeekRangeFromDate(date);

	return createKey(model, {
		type: "week",
		start_date: formatDateRequest(start),
		end_date: formatDateRequest(end),
		...keyParams,
	});
};

type CacheUpdater<T> = (prev: T | null | undefined) => T;

export function syncCachesByDate<T>(
	model: Model,
	date: string,
	updater: CacheUpdater<T>,
	isConnected: boolean | null,
	setData?: (updater: CacheUpdater<T>) => void,
	currentKey?: string,
	keyParams?: Record<string, string>,
) {
	const dayKey = getDayKeyFromDate(model, date, keyParams);
	const weekKey = getWeekKeyFromDate(model, date, keyParams);

	// update current hook state
	if (setData) setData(updater);

	// sync other caches
	if (currentKey !== dayKey) {
		updateCache(dayKey, updater);
	}

	const weekData = getCache(weekKey, isConnected);
	if (weekData) updateCache(weekKey, updater);
}
