import type { ColumnDef } from '@tanstack/table-core';
import { type SampleSummary } from '$lib/types/onion';
import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableSentButton from './data-table-sent-button.svelte';
import DataTableMq135Button from './data-table-mq135-button.svelte';
import DataTableMq136Button from './data-table-mq136-button.svelte';
import DataTableMq137Button from './data-table-mq137-button.svelte';
import DataTableMq138Button from './data-table-mq138-button.svelte';
import { Badge } from '$lib/components/ui/badge';

const fmtDate = (d: Date | string | number) =>
	new Date(d).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	});

const nf1 = new Intl.NumberFormat(undefined, {
	minimumFractionDigits: 0,
	maximumFractionDigits: 1
});

const nf4 = new Intl.NumberFormat(undefined, {
	minimumFractionDigits: 4,
	maximumFractionDigits: 4
});

export const columns: ColumnDef<SampleSummary>[] = [
	{
		id: 'sentAt',
		accessorFn: (row) => new Date(row.sentAt).getTime(),
		cell: ({ row }) => fmtDate(row.original.sentAt),
		sortingFn: (a, b, colId) => (a.getValue<number>(colId) ?? 0) - (b.getValue<number>(colId) ?? 0),
		header: ({ column }) =>
			renderComponent(DataTableSentButton, {
				onclick: column.getToggleSortingHandler(),
				sorted: column.getIsSorted()
			})
	},
	{
		accessorKey: 'tagName',
		header: 'Tag'
	},
	{
		accessorKey: 'spoiled',
		header: 'Condition',
		cell: ({ getValue }) => (getValue<boolean>() ? '🧅 Spoiled' : '✅ Good')
	},
	{
		accessorKey: 'spoilProb',
		header: 'Spoiled %',
		cell: ({ getValue }) => {
			const p = getValue<number | null | undefined>();
			return p == null ? '—' : `${(p * 100).toFixed(2)}%`;
		}
	},
	{
		accessorKey: 'avgTemp',
		header: 'Temperature',
		cell: ({ getValue }) => `${nf1.format(Number(getValue() ?? 0))} °C`
	},
	{
		accessorKey: 'avgHumidity',
		header: 'Humidity',
		cell: ({ getValue }) => `${nf1.format(Number(getValue() ?? 0))}%`
	},
	{
		accessorKey: 'areaMq135Corr',
		cell: ({ getValue }) => nf4.format(Number(getValue() ?? 0)),
		header: ({ column }) =>
			renderComponent(DataTableMq135Button, {
				onclick: column.getToggleSortingHandler(),
				sorted: column.getIsSorted()
			})
	},
	{
		accessorKey: 'areaMq136Corr',
		cell: ({ getValue }) => nf4.format(Number(getValue() ?? 0)),
		header: ({ column }) =>
			renderComponent(DataTableMq136Button, {
				onclick: column.getToggleSortingHandler(),
				sorted: column.getIsSorted()
			})
	},
	{
		accessorKey: 'areaMq137Corr',
		cell: ({ getValue }) => nf4.format(Number(getValue() ?? 0)),
		header: ({ column }) =>
			renderComponent(DataTableMq137Button, {
				onclick: column.getToggleSortingHandler(),
				sorted: column.getIsSorted()
			})
	},
	{
		accessorKey: 'areaMq138Corr',
		cell: ({ getValue }) => nf4.format(Number(getValue() ?? 0)),
		header: ({ column }) =>
			renderComponent(DataTableMq138Button, {
				onclick: column.getToggleSortingHandler(),
				sorted: column.getIsSorted()
			})
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { sampleId: row.original.sampleId });
		}
	}
];
