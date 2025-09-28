import type { ColumnDef } from '@tanstack/table-core';
import type { LogItem } from './+page.server';
import DataDateButton from './data-date-button.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import { dateRangeFilter } from '$lib/types/dateRange';
import { userSearchFilter } from '$lib/types/userSearch';
import { deviceSearchFilter } from '$lib/types/deviceSearch';

export const columns: ColumnDef<LogItem>[] = [
	{
		accessorKey: 'loggedAt',
		header: ({ column }) =>
			renderComponent(DataDateButton, {
				onclick: column.getToggleSortingHandler(),
				sorted: column.getIsSorted()
			}),
		cell: ({ getValue }) => {
			const d = new Date(getValue<string>());
			return d.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
		},
		filterFn: dateRangeFilter
	},
	{
		id: 'user',
		header: 'User',
		accessorFn: (row) => row.username ?? String(row.userId ?? ''), // keeps sorting/filtering sensible
		sortingFn: 'alphanumeric',
		filterFn: userSearchFilter,
		cell: ({ row }) => {
			const name = row.original.username ?? '';
			const id = row.original.userId ?? '';

			if (name == '') {
				return '---';
			}

			return `${name}  (id:${id})`;
		}
	},
	{
		id: 'device',
		header: 'Device',
		accessorFn: (row) => row.deviceName ?? String(row.deviceId ?? ''), // keeps sorting/filtering sensible
		sortingFn: 'alphanumeric',
		filterFn: deviceSearchFilter,
		cell: ({ row }) => {
			const name = row.original.deviceName ?? '';
			const id = row.original.deviceId ?? '';

			if (name == '') {
				return '---';
			}

			return `${name}  (id:${id})`;
		}
	},
	{
		accessorKey: 'entityType',
		header: 'Entity'
	},
	{
		accessorKey: 'action',
		header: 'Action'
	},
	{
		accessorKey: 'description',
		header: 'Description'
	}
];
