<script lang="ts">
	import TagFilters from './tag-filters.svelte';
	import DashboardTagFilters from './dashboard-tag-filters.svelte';
	import { type SampleSummary } from '$lib/types/onion';
	import type { Tag } from '$lib/types/tag';
	import Button from './ui/button/button.svelte';

	let context = $state<ChartContextValue>();
	let mq135 = $state(true);
	let mq136 = $state(true);
	let mq137 = $state(true);
	let mq138 = $state(true);

	interface PageData {
		apiUrl: string;
		items: SampleSummary[];
		breadcrumbs: any[];
		tags: Tag[];
	}

	type SafePageData = Partial<PageData>;
	let { data = {} as SafePageData }: { data?: SafePageData } = $props();
	const items = $derived.by<SampleSummary[]>(() => data?.items ?? []);
	const tagsList = $derived.by<Tag[]>(() => data?.tags ?? []);

	let tagFilters = $state<number[]>([]);

	import { scaleBand } from 'd3-scale';
	import { BarChart, type ChartContextValue } from 'layerchart';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cubicInOut } from 'svelte/easing';
	import PieChart from './pie-chart.svelte';

	const colors = [
		'var(--chart-1)',
		'var(--chart-2)',
		'var(--chart-3)',
		'var(--chart-4)',
		'var(--chart-5)'
	];

	const chartData = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 }
	];

	const chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-3)' },
		mobile: { label: 'Mobile', color: 'var(--chart-4)' }
	} satisfies Chart.ChartConfig;

	const chartConfigDefault = () => {
		let averageAreas = [0, 0, 0, 0];
		for (const item of items) {
			averageAreas[0] += item?.areaMq135Corr ?? 0;
			averageAreas[1] += item?.areaMq136Corr ?? 0;
			averageAreas[2] += item?.areaMq137Corr ?? 0;
			averageAreas[3] += item?.areaMq138Corr ?? 0;
		}
		averageAreas[0] = averageAreas[0] / items.length;
		averageAreas[1] = averageAreas[1] / items.length;
		averageAreas[2] = averageAreas[2] / items.length;
		averageAreas[3] = averageAreas[3] / items.length;

		console.log(averageAreas);

		let ret = [];
		if (mq135) {
			ret.push({ sensor: 'Mq135', averageAUC: averageAreas[0] });
		}
		if (mq136) {
			ret.push({ sensor: 'Mq136', averageAUC: averageAreas[0] });
		}
		if (mq137) {
			ret.push({ sensor: 'Mq137', averageAUC: averageAreas[0] });
		}
		if (mq138) {
			ret.push({ sensor: 'Mq138', averageAUC: averageAreas[0] });
		}

		return [
			{ sensor: 'Mq135', averageAUC: averageAreas[0] },
			{ sensor: 'Mq136', averageAUC: averageAreas[1] },
			{ sensor: 'Mq137', averageAUC: averageAreas[2] },
			{ sensor: 'Mq138', averageAUC: averageAreas[3] }
		];
	};

	const chartConfigResponsive = $derived.by(() => {
		if (tagFilters.length == 0) {
			return {
				sensor: { label: 'Average AUC', color: 'var(--char-1)' }
			} satisfies Chart.ChartConfig;
		} else {
			let config = {};
			const set = new Set<string>();
			for (const it of items) {
				if (tagFilters.includes(it.tagId)) {
					const name = it.tagName?.trim();
					if (name) set.add(name);
				}
			}

			let i = 0;
			for (const tagName of set) {
				config[tagName] = { label: tagName, color: colors[i % colors.length] };
				i++;
			}

			return config;
		}
	});

	const pieChartDataResponsive = $derived.by(() => {
		let spoiled = 0,
			good = 0;

		if (tagFilters.length == 0) {
			for (const it of items) {
				if (it.spoiled) {
					spoiled++;
				} else {
					good++;
				}
			}
			return [
				{ status: 'spoiled', onions: spoiled, color: 'var(--chart-10)' },
				{ status: 'good', onions: good, color: 'var(--chart-6)' }
			];
		} else {
			for (const it of items) {
				if (!tagFilters.includes(it.tagId)) {
					continue;
				}
				if (it.spoiled) {
					spoiled++;
				} else {
					good++;
				}
			}
			return [
				{ status: 'spoiled', onions: spoiled, color: 'var(--chart-10)' },
				{ status: 'good', onions: good, color: 'var(--chart-6)' }
			];
		}
	});

	const chartDataResponsive = $derived.by(() => {
		if (tagFilters.length == 0) {
			let averageAreas = [0, 0, 0, 0];
			for (const item of items) {
				averageAreas[0] += item?.areaMq135Corr ?? 0;
				averageAreas[1] += item?.areaMq136Corr ?? 0;
				averageAreas[2] += item?.areaMq137Corr ?? 0;
				averageAreas[3] += item?.areaMq138Corr ?? 0;
			}
			averageAreas[0] = averageAreas[0] / items.length;
			averageAreas[1] = averageAreas[1] / items.length;
			averageAreas[2] = averageAreas[2] / items.length;
			averageAreas[3] = averageAreas[3] / items.length;

			console.log(averageAreas);

			let ret = [];
			if (mq135) {
				ret.push({ sensor: 'Mq135', averageAUC: averageAreas[0] });
			}
			if (mq136) {
				ret.push({ sensor: 'Mq136', averageAUC: averageAreas[1] });
			}
			if (mq137) {
				ret.push({ sensor: 'Mq137', averageAUC: averageAreas[2] });
			}
			if (mq138) {
				ret.push({ sensor: 'Mq138', averageAUC: averageAreas[0] });
			}

			return ret;
		} else {
			const set = new Set<string>();
			for (const it of items) {
				if (tagFilters.includes(it.tagId)) {
					const name = it.tagName?.trim();
					if (name) set.add(name);
				}
			}
			let averageAreas: Record<
				string,
				{ mq135: number; mq136: number; mq137: number; mq138: number; count: number }
			> = {};
			for (const item of items) {
				if (tagFilters.includes(item.tagId)) {
					if (item.tagName) {
						if (!averageAreas[item.tagName]) {
							averageAreas[item.tagName] = { mq135: 0, mq136: 0, mq137: 0, mq138: 0, count: 0 };
						}
						averageAreas[item.tagName].mq135 += item?.areaMq135Corr ?? 0;
						averageAreas[item.tagName].mq136 += item?.areaMq136Corr ?? 0;
						averageAreas[item.tagName].mq137 += item?.areaMq137Corr ?? 0;
						averageAreas[item.tagName].mq138 += item?.areaMq138Corr ?? 0;
						averageAreas[item.tagName].count++;
					}
				}
			}

			const tagNames = Object.keys(averageAreas);
			const rows = [
				{ sensor: 'Mq135' },
				{ sensor: 'Mq136' },
				{ sensor: 'Mq137' },
				{ sensor: 'Mq138' }
			]
				.filter((row) => mq135 || row.sensor !== 'Mq135')
				.filter((row) => mq136 || row.sensor !== 'Mq136')
				.filter((row) => mq137 || row.sensor !== 'Mq137')
				.filter((row) => mq138 || row.sensor !== 'Mq138')
				.map((row) => {
					for (const t of tagNames) {
						const a = averageAreas[t];
						const val =
							row.sensor === 'Mq135'
								? a.mq135
								: row.sensor === 'Mq136'
									? a.mq136
									: row.sensor === 'Mq137'
										? a.mq137
										: a.mq138;
						(row as any)[t] = a.count ? val / a.count : 0; // average per tag
					}

					return row;
				});

			//x = 'sensor';
			return rows;
		}
		return chartConfigDefault();
	});

	const chartSeriesResponsive = $derived.by(() => {
		if (tagFilters.length == 0) {
			return [{ key: 'averageAUC', label: 'Average AUC', color: 'var(--chart-1)' }];
		} else {
			const series = [];
			const set = new Set<string>();
			for (const it of items) {
				if (tagFilters.includes(it.tagId)) {
					const name = it.tagName?.trim();
					if (name) set.add(name);
				}
			}
			let i = 0;
			for (const value of set) {
				series.push({ key: value, label: value, color: colors[i % colors.length] });
				i++;
			}

			return series;
		}
	});

	const xResponsive = $derived.by(() => (tagFilters.length === 0 ? 'All' : 'sensor'));

	$inspect(pieChartDataResponsive);
</script>

<div class="my-3">
	<div class="rounded border bg-white p-5 shadow dark:bg-card">
		<TagFilters bind:tagFilters tags={tagsList} />
		<div class="mt-5">
			<DashboardTagFilters tags={tagsList} bind:tagFilters />
		</div>
	</div>

	<div class="mt-3">
		<div class="grid grid-cols-2 gap-2 rounded p-1 sm:grid-cols-4">
			<Button
				variant={mq135 ? 'default' : 'outline'}
				onclick={() => {
					mq135 = !mq135;
				}}>MQ135</Button
			>
			<Button
				variant={mq136 ? 'default' : 'outline'}
				onclick={() => {
					mq136 = !mq136;
				}}>MQ136</Button
			>
			<Button
				variant={mq137 ? 'default' : 'outline'}
				onclick={() => {
					mq137 = !mq137;
				}}>MQ137</Button
			>
			<Button
				variant={mq138 ? 'default' : 'outline'}
				onclick={() => {
					mq138 = !mq138;
				}}>MQ138</Button
			>
		</div>
	</div>

	<div class="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
		<div class="h-full">
			<PieChart data={pieChartDataResponsive} />
		</div>

		<Card.Root class="flex h-full flex-col">
			<Card.Header class="pb-2">
				<Card.Title>Average AUC</Card.Title>
				<Card.Description>All Time</Card.Description>
			</Card.Header>

			<Card.Content class="flex-1">
				<Chart.Container config={chartConfigResponsive} class="h-[260px] w-full md:h-[320px]">
					<BarChart
						bind:context
						data={chartDataResponsive}
						xScale={scaleBand().padding(0.25)}
						x="sensor"
						axis="x"
						series={chartSeriesResponsive}
						x1Scale={scaleBand().paddingInner(0.2)}
						seriesLayout="group"
						rule={false}
						legend
						props={{
							bars: {
								stroke: 'none',
								strokeWidth: 0,
								rounded: 'all',
								initialY: context?.height,
								initialHeight: 0,
								motion: {
									y: { type: 'tween', duration: 500, easing: cubicInOut },
									height: { type: 'tween', duration: 500, easing: cubicInOut }
								}
							},
							highlight: { area: { fill: 'none' } },
							xAxis: { format: (d) => d }
						}}
					>
						{#snippet tooltip()}
							<Chart.Tooltip indicator="dashed" />
						{/snippet}
					</BarChart>
				</Chart.Container>
			</Card.Content>

			<Card.Footer />
		</Card.Root>
	</div>
</div>
