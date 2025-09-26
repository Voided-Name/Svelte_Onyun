<script lang="ts">
	import type { SampleDetail } from '$lib/types/onion';
	import type { SampleSummary } from '$lib/types/onion';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	type PageData = {
		apiUrl: string;
		detail: SampleDetail;
		breadcrumbs: any[];
		areas: SampleSummary;
	};
	let { data }: { data: PageData } = $props();
	import { AreaChart, Layer, Axis } from 'layerchart';
	import { curveNatural } from 'd3-shape';
	import { scaleLinear } from 'd3-scale'; // Changed from scaleUtc to scaleLinear
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	const points = data.detail.points;
	console.log(data.areas);

	/* ---------- RAW SERIES (unchanged) ---------- */
	const resultMq135 = points.map((point, index) => ({ n: index, sensor: point.mq135 }));
	const resultMq136 = points.map((point, index) => ({ n: index, sensor: point.mq136 }));
	const resultMq137 = points.map((point, index) => ({ n: index, sensor: point.mq137 }));
	const resultMq138 = points.map((point, index) => ({ n: index, sensor: point.mq138 }));

	/* ---------- BASELINE-CORRECTED SERIES (new) ---------- */
	function makeCorrected(series: { n: number; sensor: number | null }[], N = 20) {
		const k = Math.min(N, series.length);
		const base = k > 0 ? series.slice(0, k).reduce((s, p) => s + Number(p.sensor ?? 0), 0) / k : 0;
		return series.map((p) => ({ n: p.n, sensor: Math.max(Number(p.sensor ?? 0) - base, 0) }));
	}
	const resultMq135Corr = makeCorrected(resultMq135);
	const resultMq136Corr = makeCorrected(resultMq136);
	const resultMq137Corr = makeCorrected(resultMq137);
	const resultMq138Corr = makeCorrected(resultMq138);

	let chartData = $state(resultMq135);

	const chartConfig = {
		mq135: { label: 'MQ135 Sensor', color: 'var(--chart-1)' } // Updated label
	} satisfies Chart.ChartConfig;

	const mqCardInfo = $state([
		{
			sensor: 'MQ135',
			description:
				'A gas sensor that detects air quality by sensing gases like NH₃, NOₓ, alcohol, benzene, smoke, and CO₂.',
			area: data.areas.areaMq135,
			selectedSensor: true
		},
		{
			sensor: 'MQ136',
			description:
				'A gas sensor specifically designed to detect hydrogen sulfide (H₂S) in the air.',
			area: data.areas.areaMq136,
			selectedSensor: false
		},
		{
			sensor: 'MQ137',
			description: 'A gas sensor used to detect ammonia (NH₃) concentrations in the air.',
			area: data.areas.areaMq137,
			selectedSensor: false
		},
		{
			sensor: 'MQ138',
			description:
				'A gas sensor that detects a wide range of volatile organic compounds (VOCs) including benzene, alcohol, and smoke.',
			area: data.areas.areaMq138,
			selectedSensor: false
		}
	]);

	function selectSensor(sensor: string) {
		selected = sensor;
		updateChartData();
	}

	let corrected = $state(true);

	function updateChartData() {
		if (selected === 'MQ135') chartData = corrected ? resultMq135Corr : resultMq135;
		else if (selected === 'MQ136') chartData = corrected ? resultMq136Corr : resultMq136;
		else if (selected === 'MQ137') chartData = corrected ? resultMq137Corr : resultMq137;
		else if (selected === 'MQ138') chartData = corrected ? resultMq138Corr : resultMq138;

		// keep the selected flags as you already do
		mqCardInfo[0].selectedSensor = selected === 'MQ135';
		mqCardInfo[1].selectedSensor = selected === 'MQ136';
		mqCardInfo[2].selectedSensor = selected === 'MQ137';
		mqCardInfo[3].selectedSensor = selected === 'MQ138';
	}

	$effect(() => {
		updateChartData();
	});

	function getAreaFor(sensor: string) {
		if (!corrected) {
			return sensor === 'MQ135'
				? data.areas.areaMq135
				: sensor === 'MQ136'
					? data.areas.areaMq136
					: sensor === 'MQ137'
						? data.areas.areaMq137
						: data.areas.areaMq138;
		}
		return sensor === 'MQ135'
			? data.areas.areaMq135Corr
			: sensor === 'MQ136'
				? data.areas.areaMq136Corr
				: sensor === 'MQ137'
					? data.areas.areaMq137Corr
					: data.areas.areaMq138Corr;
	}

	let selected = $state('MQ135');
</script>

<div class="m-5">
	<div class="my-3 grid grid-cols-4 gap-2">
		{#each mqCardInfo as mqInfo}
			<Card.Root class={mqInfo.selectedSensor ? 'border-violet-700' : ''}>
				<Card.Header>
					<Card.Title>{mqInfo.sensor}</Card.Title>
					<Card.Description>
						{mqInfo.description}
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>AUC: {getAreaFor(mqInfo.sensor)}</p>
				</Card.Content>
				<Card.Footer>
					<Button variant="default" onclick={() => selectSensor(mqInfo.sensor)}>View</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
	<div class="m-3 flex items-center gap-3">
		<Checkbox id="terms" bind:checked={corrected} />
		Corrected AUC (Remove Baseline)
	</div>
	<Card.Root>
		<Card.Header>
			<Card.Title>Sensor Response (Area) - {selected}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="h-[350px] w-full p-5">
				<Chart.Container config={chartConfig}>
					<div class="h-[300px] w-full rounded border">
						<AreaChart
							data={chartData}
							x="n"
							xScale={scaleLinear()}
							yDomain={null}
							series={[
								{
									key: 'sensor', // Changed from 'desktop' to 'mq135'
									label: 'MQ135 Sensor', // Updated label
									color: chartConfig.mq135.color
								}
							]}
							axis="both"
							props={{
								area: {
									curve: curveNatural,
									'fill-opacity': 0.4,
									line: { class: 'stroke-1' },
									motion: 'tween'
								},
								xAxis: {
									format: (v: number) => `${v}` // Updated format function
								}
							}}
						>
							{#snippet tooltip()}
								<Chart.Tooltip labelFormatter={(v: number) => `Sample ${v}`} indicator="line" />
							{/snippet}
						</AreaChart>
					</div>
				</Chart.Container>
			</div>
		</Card.Content>
	</Card.Root>
</div>
