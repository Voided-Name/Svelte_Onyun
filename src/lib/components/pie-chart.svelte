<script lang="ts">
	import { PieChart } from 'layerchart';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	const chartConfig = {
		onions: { label: 'Onions' },
		spoiled: { label: 'Spoiled', color: 'red' },
		good: { label: 'Good', color: 'black' }
	} satisfies Chart.ChartConfig;

	let { data } = $props();
	$inspect(data);
</script>

<Card.Root class="flex flex-col">
	<Card.Header class="items-center">
		<Card.Title>Spoiled</Card.Title>
		<Card.Description>All Time</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1">
		<Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
			<PieChart
				{data}
				key="status"
				value="onions"
				legend
				c="color"
				props={{
					pie: {
						motion: 'tween'
					}
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</PieChart>
		</Chart.Container>
		<div class="mt-2 max-w-40 rounded border p-2">
			<p>
				Spoiled: {data[0].onions} / {data[0].onions + data[1].onions}
			</p>
			<p>
				Good: {data[1].onions} / {data[0].onions + data[1].onions}
			</p>
		</div>
	</Card.Content>
</Card.Root>
