import type { ColumnDef } from '@tanstack/table-core';
import type { LogItem } from './+page.server';

const fmtDate = (iso: string | null) => {
	if (!iso) return '—';
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
};

export const columns: ColumnDef<LogItem>[] = [
	{
		id: 'loggedAt',
		accessorFn: (row) => new Date(row.loggedAt ?? 0).getTime(),
		cell: ({ row }) => fmtDate(row.original.loggedAt),
		header: 'Time',
		sortingFn: (a, b, id) => (a.getValue<number>(id) ?? 0) - (b.getValue<number>(id) ?? 0)
	},
	{ accessorKey: 'username', header: 'User' },
	{ accessorKey: 'deviceName', header: 'Device' },
	{ accessorKey: 'entityType', header: 'Entity' },
	{ accessorKey: 'action', header: 'Action' },
	{ accessorKey: 'description', header: 'Description' }
];
