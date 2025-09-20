<script lang="ts">
	import type { SampleDetail } from '$lib/types/onion';
	import { Button } from '$lib/components/ui/button/index.js';
	import Chart from './Chart.svelte';

	interface PageData {
		apiUrl: string;
		detail: SampleDetail;
		breadcrumbs: any[];
	}
	let { data }: { data: PageData } = $props();

	const metrics = ['temperature', 'humidity', 'mq135', 'mq136', 'mq137', 'mq138'] as const;
	type Metric = (typeof metrics)[number];
	let metric = $state<Metric>('temperature');

	// helpers
	const fmt = (iso: string) => new Date(iso).toLocaleString();

	// compute scales for current metric
	$effect(() => {
		// trigger reactive redraw
		void metric;
	});
</script>

<div class="mx-auto max-w-6xl space-y-4 p-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Sample {data.detail.sampleId}</h1>
		<a href="/app/data"><Button variant="secondary">Back</Button></a>
	</div>

	<div class="grid gap-2 text-sm">
		<div><span class="text-muted-foreground">Points:</span> {data.detail.count}</div>
	</div>

	<div class="flex items-center gap-2">
		<label class="text-sm text-muted-foreground">Metric</label>
		<select bind:value={metric} class="rounded-md border p-1 text-sm">
			{#each metrics as m}<option value={m}>{m}</option>{/each}
		</select>
	</div>

	<div class="mx-auto w-full max-w-4xl">
		<Chart {metric} points={data.detail.points} />
	</div>

	<div class="mx-auto w-full max-w-6xl overflow-x-auto">
		<table class="mt-2 w-full rounded-md border text-sm">
			<thead>
				<tr class="bg-muted text-left">
					<th class="p-2">#</th>
					<th class="p-2">Time</th>
					<th class="p-2">Temp (°C)</th>
					<th class="p-2">RH (%)</th>
					<th class="p-2">MQ135</th>
					<th class="p-2">MQ136</th>
					<th class="p-2">MQ137</th>
					<th class="p-2">MQ138</th>
				</tr>
			</thead>
			<tbody>
				{#each data.detail.points as p, i}
					<tr class="border-t">
						<td class="p-2">{i + 1}</td>
						<td class="p-2">{new Date(p.t).toLocaleTimeString()}</td>
						<td class="p-2">{p.temperature ?? '—'}</td>
						<td class="p-2">{p.humidity ?? '—'}</td>
						<td class="p-2">{p.mq135 ?? '—'}</td>
						<td class="p-2">{p.mq136 ?? '—'}</td>
						<td class="p-2">{p.mq137 ?? '—'}</td>
						<td class="p-2">{p.mq138 ?? '—'}</td>
					</tr>
				{/each}
			</tbody>
			<!-- ...the rest of your table... -->
		</table>
	</div>
</div>
