<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		ColumnFiltering
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import {
		type DateValue,
		toCalendarDateTime,
		getLocalTimeZone,
		Time
	} from '@internationalized/date';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import DatePicker from '$lib/components/date-picker.svelte';
	import { Label } from '$lib/components/ui/label/index.js';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};

	let { data, columns }: DataTableProps<TData, TValue> = $props();

	const tz = getLocalTimeZone();

	function getRange() {
		return (table.getColumn('loggedAt')?.getFilterValue() as { from?: string; to?: string }) ?? {};
	}

	function setRange(next: { from?: string; to?: string }) {
		table.getColumn('loggedAt')?.setFilterValue(next);
	}

	function fromValueToISO(dv: DateValue | undefined): string | undefined {
		if (!dv) return undefined;
		const dt = toCalendarDateTime(dv, new Time(0, 0, 0, 0));
		return new Date(dt.toDate(tz)).toISOString();
	}

	function toValueToISO(dv: DateValue | undefined): string | undefined {
		if (!dv) return undefined;
		const dt = toCalendarDateTime(dv, new Time(23, 59, 59, 999));
		return new Date(dt.toDate(tz)).toISOString();
	}

	function clearRange() {
		fromDV = undefined;
		toDV = undefined;
		setRange({ from: undefined, to: undefined });
	}

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let fromDV: DateValue | undefined = $state(undefined);
	let toDV: DateValue | undefined = $state(undefined);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			}
		}
	});

	$effect(() => {
		const nextFrom = fromValueToISO(fromDV);
		const r = getRange();
		if (r.from !== nextFrom) setRange({ ...r, from: nextFrom });
	});

	$effect(() => {
		const nextTo = toValueToISO(toDV);
		const r = getRange();
		if (r.to !== nextTo) setRange({ ...r, to: nextTo });
	});

	let pageIndex = $derived(table.getState().pagination.pageIndex);
	let pageCount = $derived(table.getPageCount());
</script>

<div class="p-4">
	<div class="mb-3 flex flex-wrap items-end gap-2 gap-y-3">
		<div class="mb-0 flex items-center gap-2">
			<DatePicker bind:value={fromDV} label="From" />
			<DatePicker bind:value={toDV} label="To" />
		</div>

		<Input
			placeholder="Filter user..."
			value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
			onchange={(e) => {
				table.getColumn('user')?.setFilterValue(e.currentTarget.value);
			}}
			oninput={(e) => {
				table.getColumn('user')?.setFilterValue(e.currentTarget.value);
			}}
			class="w-full min-w-[12rem] sm:max-w-xs sm:flex-1"
		/>
		<Input
			placeholder="Filter device..."
			value={(table.getColumn('device')?.getFilterValue() as string) ?? ''}
			onchange={(e) => {
				table.getColumn('device')?.setFilterValue(e.currentTarget.value);
			}}
			oninput={(e) => {
				table.getColumn('device')?.setFilterValue(e.currentTarget.value);
			}}
			class="w-full min-w-[12rem] sm:max-w-xs sm:flex-1"
		/>
		<Input
			placeholder="Filter entity..."
			value={(table.getColumn('entity')?.getFilterValue() as string) ?? ''}
			onchange={(e) => {
				table.getColumn('entity')?.setFilterValue(e.currentTarget.value);
			}}
			oninput={(e) => {
				table.getColumn('entity')?.setFilterValue(e.currentTarget.value);
			}}
			class="w-full min-w-[12rem] sm:max-w-xs sm:flex-1"
		/>
		<Input
			placeholder="Filter action..."
			value={(table.getColumn('action')?.getFilterValue() as string) ?? ''}
			onchange={(e) => {
				table.getColumn('action')?.setFilterValue(e.currentTarget.value);
			}}
			oninput={(e) => {
				table.getColumn('action')?.setFilterValue(e.currentTarget.value);
			}}
			class="w-full min-w-[12rem] sm:max-w-xs sm:flex-1"
		/>
	</div>
	<div class="rounded-md border bg-card">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
		<div>
			{pageIndex + 1}
			/{pageCount}
		</div>
		<Button
			variant="outline"
			size="sm"
			class="bg-card"
			onclick={() => table.setPageIndex(0)}
			disabled={!table.getCanPreviousPage()}
		>
			<span>&#8606;</span>
		</Button>
		<Button
			variant="outline"
			size="sm"
			class="bg-card"
			onclick={() => table.previousPage()}
			disabled={!table.getCanPreviousPage()}
		>
			Previous
		</Button>
		<Button
			variant="outline"
			size="sm"
			class="bg-card"
			onclick={() => table.nextPage()}
			disabled={!table.getCanNextPage()}
		>
			Next
		</Button>
		<Button
			variant="outline"
			size="sm"
			class="bg-card"
			onclick={() => table.setPageIndex(pageCount - 1)}
			disabled={!table.getCanNextPage()}
		>
			<span>&#8608;</span>
		</Button>
	</div>
</div>
