import type { ColumnDef } from '@tanstack/table-core';
import type { Tag } from '$lib/types/tag';
import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableCreatedButton from './data-table-created-button.svelte';

const fmt = (d: string | number | Date) =>
	new Date(d).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	});

export const columns: ColumnDef<Tag>[] = [
	{
		accessorKey: 'tagId',
		header: 'Tag ID'
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'description',
		header: 'Description'
	},
	// {
	// 	accessorKey: 'createdAt',
	// 	cell: ({ getValue }) => fmt(getValue<string>()),
	// 	header: ({ column }) =>
	// 		renderComponent(DataTableCreatedButton, {
	// 			onclick: column.getToggleSortingHandler()
	// 		})
	// },
	{
		id: 'createdAt',
		accessorFn: (row) => new Date(row.createdAt).getTime(),
		sortingFn: (a, b, colId) => (a.getValue<number>(colId) ?? 0) - (b.getValue<number>(colId) ?? 0),
		cell: ({ row }) => fmt(row.original.createdAt),
		header: ({ column }) =>
			renderComponent(DataTableCreatedButton, {
				onclick: () => {
					const isSorted = column.getIsSorted();
					console.log(isSorted);
					if (!isSorted) {
						column.toggleSorting(true);
					} else {
						column.toggleSorting();
					}
				},
				sorted: column.getIsSorted()
			})
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.tagId });
		}
	}
];
