export type DateRange = { from?: string; to?: string };

export function dateRangeFilter<RowData>(row: any, columnId: string, range: DateRange | undefined) {
	if (!range || (!range.from && !range.to)) return true;

	const raw = row.getValue<string>(columnId);
	if (!raw) return false;

	const ts = Date.parse(raw);
	if (Number.isNaN(ts)) return false;

	const { from, to } = range;

	if (from && ts < Date.parse(from)) return false;
	if (to && ts > Date.parse(to)) return false;

	return true;
}
