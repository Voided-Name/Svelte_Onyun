<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';
	import { type SampleSummary } from '$lib/types/onion';

	interface PageData {
		apiUrl: string;
		items: SampleSummary[];
		breadcrumbs: any[];
	}
	let { data }: { data: PageData } = $props();

	const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : '—');
	const secs = (s: number | null) => (s == null ? '—' : `${s.toFixed(1)}s`);
	const num = (n: number | null | undefined, d = 2) => (n == null ? '—' : n.toFixed(d));
</script>

<div class="p-4">
	<h1 class="mb-4 text-2xl font-semibold">Onion Samples</h1>
	{#if !data.items?.length}
		<p class="text-sm text-muted-foreground">No samples found.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="min-w-full rounded-md border">
				<thead>
					<tr class="bg-muted text-left">
						<th class="p-2">Sample ID</th>
						<th class="p-2">Sent At</th>
						<th class="p-2">Avg Temp (°C)</th>
						<th class="p-2">Avg RH (%)</th>
						<th class="p-2">Avg MQ135</th>
						<th class="p-2">Avg MQ136</th>
						<th class="p-2">Avg MQ137</th>
						<th class="p-2">Avg MQ138</th>
						<th class="p-2">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each data.items as s (s.sampleId)}
						<tr class="border-t">
							<td class="p-2 font-mono">{s.sampleId}</td>
							<td class="p-2">{fmt(s.sentAt)}</td>
							<td class="p-2">{num(s.avgTemp)}</td>
							<td class="p-2">{num(s.avgHumidity)}</td>
							<td class="p-2">{num(s.areaMq135, 4)}</td>
							<td class="p-2">{num(s.areaMq136, 4)}</td>
							<td class="p-2">{num(s.areaMq137, 4)}</td>
							<td class="p-2">{num(s.areaMq138, 4)}</td>
							<td class="p-2">
								<a href={`/app/data/${s.sampleId}`}>
									<Button size="sm">Show</Button>
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
