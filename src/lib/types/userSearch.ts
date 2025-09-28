export function userSearchFilter<RowData>(row: any, columnId: string, value: string | undefined) {
	if (!value) return true;

	const needle = String(value).toLowerCase().trim();

	const name = (row.getValue<string>(columnId) ?? '').toLowerCase();
	const id = String(row.original?.userId ?? '').toLowerCase();

	// support plain digits "2" and the literal "(id:2)"
	const normalizedHaystack = `${name} (id:${id})`.toLowerCase();

	return (
		normalizedHaystack.includes(needle) ||
		// optional: special case for numeric-only search meaning "id contains"
		(/^\d+$/.test(needle) && id.includes(needle))
	);
}
