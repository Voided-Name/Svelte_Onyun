<script lang="ts">
	/* UI + table */
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import DataTable from './data-table.svelte';
	import { columns } from './columns';
	import { type SampleSummary } from '$lib/types/onion';

	/* Charts */
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { AreaChart } from 'layerchart';
	import { curveNatural } from 'd3-shape';
	import { scaleLinear } from 'd3-scale';

	/* Math formulas (your MathML-only component) */
	import MathBlock from '$lib/components/Math.svelte';

	/* ---- alias the global Math so it won't ever collide with component names ---- */
	const mathblock = globalThis.Math;

	/* ----- sample series (trend + burst + ripple) ----- */
	const LEN = 120;
	const rawVals = Array.from({ length: LEN }, (_, i) => {
		const trend = 0.02 * i;
		const burst = 3 * mathblock.exp(-((i - 75) ** 2) / (2 * 14 ** 2));
		const ripple = 0.25 * mathblock.sin(i / 6);
		return 6 + trend + burst + ripple;
	});

	/* ----- parameters (match backend) ----- */
	const N = 20; // baseline window
	const t0 = 50; // AUC start index
	const dt = 1; // uniform step

	const baseline = rawVals.slice(0, N).reduce((s, v) => s + v, 0) / N;
	const corrVals = rawVals.map((v) => mathblock.max(v - baseline, 0));

	type Row = { n: number; raw: number; base: number; corr: number };
	const rows: Row[] = rawVals.map((v, i) => ({
		n: i,
		raw: v,
		base: baseline,
		corr: mathblock.max(v - baseline, 0)
	}));

	function trapezoid(values: number[]) {
		let area = 0;
		for (let i = t0; i < values.length - 1; i++) {
			area += 0.5 * (values[i] + values[i + 1]) * dt;
		}
		return area;
	}
	const aucRaw = trapezoid(rawVals);
	const aucCorr = trapezoid(corrVals);

	/* chart config */
	const cfg = {
		raw: { label: 'Raw', color: 'var(--chart-1)' },
		base: { label: 'Baseline', color: 'var(--muted-foreground)' },
		corr: { label: 'Corrected', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;

	/* page data */
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
	{#if !data.items?.length}
		<p class="text-sm text-muted-foreground">No samples found.</p>
	{:else}
		<DataTable data={data.items} {columns} />
	{/if}

	<div class="mt-4 grid gap-4 lg:grid-cols-3">
		<Card.Root class="bg-card p-3">
			<Card.Header>
				<Card.Title>Area Under the Curve (Raw)</Card.Title>
				<Card.Description>Trapezoid rule from t₀ = {t0}</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<MathBlock
					display
					expr={`A_{\\text{raw},s}=\\sum_{t=${t0}}^{n-1}\\tfrac12\\,[f_s(t)+f_s(t+1)]\\,\\Delta t`}
				/>
				<div class="h-[260px] w-full">
					<Chart.Container config={cfg}>
						<AreaChart
							data={rows}
							x="n"
							xScale={scaleLinear()}
							yDomain={null}
							series={[{ key: 'raw', label: cfg.raw.label, color: cfg.raw.color }]}
							axis="both"
							props={{
								area: {
									curve: curveNatural,
									'fill-opacity': 0.35,
									line: { class: 'stroke-1' },
									motion: 'tween'
								},
								xAxis: { format: (v: number) => `${v}` }
							}}
						/>
					</Chart.Container>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="p-3">
			<Card.Header>
				<Card.Title>Baseline (per sensor)</Card.Title>
				<Card.Description>Mean of first N = {N} points</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<MathBlock display expr={`b_s=\\frac{1}{N}\\sum_{t=1}^{N} f_s(t)`} />
				<div class="h-[260px] w-full">
					<Chart.Container config={cfg}>
						<AreaChart
							data={rows}
							x="n"
							xScale={scaleLinear()}
							yDomain={null}
							series={[
								{ key: 'raw', label: cfg.raw.label, color: cfg.raw.color },
								{ key: 'base', label: cfg.base.label, color: cfg.base.color }
							]}
							axis="both"
							props={{
								area: {
									curve: curveNatural,
									'fill-opacity': 0.15,
									line: { class: 'stroke' },
									motion: 'tween'
								}
							}}
						/>
					</Chart.Container>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="p-3">
			<Card.Header>
				<Card.Title>Baseline-Corrected AUC</Card.Title>
				<Card.Description>Subtract baseline and clip at 0</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<MathBlock display expr={`g_s(t)=\\max\\big(f_s(t)-b_s,\\,0\\big)`} />
				<MathBlock
					display
					expr={`A_{\\text{corr},s}=\\sum_{t=${t0}}^{n-1}\\tfrac12\\,[g_s(t)+g_s(t+1)]\\,\\Delta t`}
				/>
				<div class="m-3 h-[260px] w-full">
					<Chart.Container config={cfg}>
						<AreaChart
							data={rows}
							x="n"
							xScale={scaleLinear()}
							yDomain={null}
							series={[{ key: 'corr', label: cfg.corr.label, color: cfg.corr.color }]}
							axis="both"
							props={{
								area: {
									curve: curveNatural,
									'fill-opacity': 0.35,
									line: { class: 'stroke-1' },
									motion: 'tween'
								},
								xAxis: { format: (v: number) => `${v}` }
							}}
						/>
					</Chart.Container>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
