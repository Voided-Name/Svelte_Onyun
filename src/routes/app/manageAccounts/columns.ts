import type { ColumnDef } from '@tanstack/table-core';
import { type Account } from '$lib/types/account';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableActions from './data-table-actions.svelte';

export const columns: ColumnDef<Account>[] = [
	{
		accessorKey: 'pinfo_id',
		header: 'Info ID',
		enableGlobalFilter: false
	},
	{
		accessorKey: 'first_name',
		header: 'First Name',
		enableGlobalFilter: true
	},
	{
		accessorKey: 'last_name',
		header: 'Last Name',
		enableGlobalFilter: true
	},
	{
		accessorKey: 'email',
		header: 'Email',
		enableGlobalFilter: false
	},
	{
		accessorKey: 'dob',
		header: 'Date of Birth',
		enableGlobalFilter: false
	},
	{
		id: 'registered',
		header: 'Registered',
		accessorFn: (row) => !!row.user, // boolean
		cell: ({ getValue }) => (getValue<boolean>() ? 'Registered' : 'False'),
		enableSorting: true,
		enableGlobalFilter: false
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.pinfo_id });
		},
		enableGlobalFilter: false
	}
];
