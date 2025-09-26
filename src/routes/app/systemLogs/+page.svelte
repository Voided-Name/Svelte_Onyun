<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
	import {
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		type VisibilityState
	} from '@tanstack/table-core';
	import type { LogItem } from './+page.server';
	import { columns as baseCols } from './columns';

	// props from server
	let { data } = $props<{
		data: {
			apiUrl: string;
			total: number;
			items: LogItem[];
			filters: Record<string, string>;
			breadcrumbs?: any[];
		};
	}>();

	// --- filters state (derived from URL/search params) ---
	let urlParams = new URLSearchParams(data.filters ?? {});
	let limit = $state<number>(Number(urlParams.get('limit') ?? 50));
	let offset = $state<number>(Number(urlParams.get('offset') ?? 0));
	let q = $state<string>(urlParams.get('q') ?? '');
	let from = $state<string>(urlParams.get('from') ?? '');
	let to = $state<string>(urlParams.get('to') ?? '');
	let userId = $state<string>(urlParams.get('userId') ?? '');
	let deviceId = $state<string>(urlParams.get('deviceId') ?? '');
	// multi-select filters: comma-separated
	let action = $state<string>(urlParams.get('action') ?? '');
	let entityType = $state<string>(urlParams.get('entityType') ?? '');
	let result = $state<string>(urlParams.get('result') ?? '');

	// build table
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});

	const columns = baseCols as ColumnDef<LogItem, unknown>[];

	const table = createSvelteTable<LogItem>({
		get data() {
			return data.items;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
		},
		onPaginationChange: (updater) => {
			pagination = typeof updater === 'function' ? updater(pagination) : updater;
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
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
			},
			get columnVisibility() {
				return columnVisibility;
			}
		}
	});

	// helper to (re)load via URL params
	function reload(opts?: { resetOffset?: boolean }) {
		const sp = new URLSearchParams();
		sp.set('limit', String(limit));
		sp.set('offset', String(opts?.resetOffset ? 0 : offset));
		if (q) sp.set('q', q);
		if (from) sp.set('from', from);
		if (to) sp.set('to', to);
		if (userId) sp.set('userId', userId);
		if (deviceId) sp.set('deviceId', deviceId);
		if (action) sp.set('action', action); // comma-separated allowed
		if (entityType) sp.set('entityType', entityType);
		if (result) sp.set('result', result);
		goto(`/app/systemLogs?${sp.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	}

	const canPrev = $derived(offset > 0);
	const canNext = $derived(offset + limit < data.total);
	function prevPage() {
		if (canPrev) {
			offset = Math.max(0, offset - limit);
			reload();
		}
	}
	function nextPage() {
		if (canNext) {
			offset = offset + limit;
			reload();
		}
	}
</script>

<div class="p-4">
	<div class="mt-4 grid grid-cols-4">
		<Input
			placeholder="Search description..."
			bind:value={q}
			onchange={(e) => ((offset = 0), reload({ resetOffset: true }))}
			class="w-64 bg-card"
		/>
	</div>
	<div class="mt-1 grid grid-cols-4 gap-3">
		<div>
			<p>From:</p>
			<Input type="datetime-local" bind:value={from} class="col-span-2 bg-card" />
		</div>
		<div>
			<p>To:</p>
			<Input type="datetime-local" bind:value={to} class="bg-card" />
		</div>
	</div>
	<div class="flex flex-wrap items-end gap-3 py-4">
		<Input placeholder="User ID" bind:value={userId} class="w-28 bg-card" />
		<Input placeholder="Device ID" bind:value={deviceId} class="w-32 bg-card" />

		<Input placeholder="Action (comma-sep)" bind:value={action} class="w-48 bg-card" />
		<Input placeholder="Entity Type (comma-sep)" bind:value={entityType} class="w-48 bg-card" />
		<Input placeholder="Result (comma-sep)" bind:value={result} class="w-40 bg-card" />

		<Input type="number" min="1" max="500" bind:value={limit} class="w-28 bg-card" />

		<Button
			variant="default"
			onclick={() => ((offset = 0), reload({ resetOffset: true }))}
			class="ml-auto">Apply</Button
		>
	</div>

	<!-- Table -->
	<div class="rounded-md border bg-card shadow-2xs">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as hg (hg.id)}
					<Table.Row>
						{#each hg.headers as header (header.id)}
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
					<Table.Row>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Backend pagination -->
	<div class="flex items-center justify-end gap-2 py-4">
		<Button variant="outline" size="sm" onclick={prevPage} disabled={!canPrev} class="bg-card"
			>Previous</Button
		>
		<Button variant="outline" size="sm" onclick={nextPage} disabled={!canNext} class="bg-card"
			>Next</Button
		>
		<span class="ml-2 text-sm text-muted-foreground">
			Showing {Math.min(data.total, offset + 1)}–{Math.min(data.total, offset + limit)} of {data.total}
		</span>
	</div>
</div>
