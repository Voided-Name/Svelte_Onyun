export function deviceSearchFilter<RowData>(row: any, columnId: string, value: string | undefined) {
	if (!value) return true;

	const needle = String(value).toLowerCase().trim();

	// accessor value (deviceName or fallback) is what TanStack passes as column value
	const name = (row.getValue<string>(columnId) ?? '').toLowerCase();
	const id = String(row.original?.deviceId ?? '').toLowerCase();

	const haystack = `${name} (id:${id})`;

	return (
		haystack.includes(needle) || (/^\d+$/.test(needle) && id.includes(needle)) // make numeric search hit id
		// for exact numeric id only, swap to: id === needle
	);
}
