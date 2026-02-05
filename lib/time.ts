export function formatTimeIntl(time: string): string {
	const date = new Date(`1970-01-01T${time}`);
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}).format(date);
}
