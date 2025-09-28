<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardFooter
	} from '$lib/components/ui/card';
	import { type DateValue } from '@internationalized/date';
	import DatePicker from '$lib/components/date-picker.svelte';
	import TagFilters from '$lib/components/tag-filters.svelte';
	import DashboardTagFilters from '$lib/components/dashboard-tag-filters.svelte';
	import type { Tag } from '$lib/types/tag';
	import { getLocalTimeZone } from '@internationalized/date';

	const toISODate = (dv?: DateValue) =>
		dv ? dv.toDate(getLocalTimeZone()).toISOString().slice(0, 10) : undefined;

	interface PageData {
		apiUrl: string;
		breadcrumbs: any[];
		tags: Tag[];
	}

	function generateReport() {
		const params = new URLSearchParams();

		const from = toISODate(fromDV);
		const to = toISODate(toDV);

		if (from) params.set('from', from);
		if (to) params.set('to', to);

		(tagFilters ?? []).forEach((id) => params.append('tagIds', String(id)));

		const url = `/api/reports${params.toString() ? `?${params}` : ''}`;

		const w = window.open(url, '_blank', 'noopener');
	}

	let fromDV: DateValue | undefined = $state(undefined);
	let toDV: DateValue | undefined = $state(undefined);
	let tagFilters = $state<number[]>([]);

	let { data = {} as PageData }: { data?: PageData } = $props();
	const tagsList = $derived.by<Tag[]>(() => data?.tags ?? []);
</script>

<div class="m-3">
	<div class="flex items-center justify-center bg-background p-4">
		<Card class="w-full max-w-md">
			<!-- a tad wider than sm -->
			<CardHeader>
				<CardTitle>Report Generation</CardTitle>
				<CardDescription>Pick date range and tags</CardDescription>
			</CardHeader>

			<CardContent class="space-y-4">
				<!-- no inner m-5 -->
				<div>
					<p class="mb-2 text-muted-foreground">Date</p>

					<!-- stack on mobile, row on ≥sm -->
					<div class="mb-4 flex flex-col gap-3 sm:flex-row">
						<DatePicker bind:value={fromDV} label="From" />
						<DatePicker bind:value={toDV} label="To" />
					</div>
				</div>
			</CardContent>

			<!-- allow wrapping so buttons never overflow -->
			<CardFooter class="flex flex-wrap justify-end gap-2">
				<DashboardTagFilters tags={tagsList} bind:tagFilters />
				<Button onclick={generateReport} class="w-full sm:w-auto">Generate Report</Button>
			</CardFooter>
		</Card>
	</div>

	<div class="rounded border bg-white p-5 shadow dark:bg-card">
		<p class="text-muted-foreground">Tags (Note: All tags will be selected if this is empty)</p>
		<hr class="mb-3" />
		<TagFilters bind:tagFilters tags={tagsList} />
	</div>
</div>
