<script lang="ts">
	import type { SamplePoint } from '$lib/types/onion';
	export let metric: 'temperature' | 'humidity' | 'mq135' | 'mq136' | 'mq137' | 'mq138' =
		'temperature';
	export let points: SamplePoint[] = [];

	// canvas
	const W = 820; // viewBox width
	const H = 260; // viewBox height

	// generous paddings so ticks/labels don't get clipped
	const PL = 60,
		PR = 28,
		PT = 28,
		PB = 48;
	const innerW = W - PL - PR;
	const innerH = H - PT - PB;

	$: xs = points.map((p) => p.timestampMs);
	$: ys = points
		.map((p) => (p as any)[metric])
		.filter((v: number | null | undefined) => typeof v === 'number') as number[];

	$: xmin = Math.min(...xs);
	$: xmax = Math.max(...xs);
	$: ymin = Math.min(...ys);
	$: ymax = Math.max(...ys);
	$: spanx = Math.max(1, xmax - xmin);
	$: spany = Math.max(1e-9, ymax - ymin);

	const xScale = (t: number) => PL + ((t - xmin) / spanx) * innerW;
	const yScale = (v: number) => PT + innerH - ((v - ymin) / spany) * innerH;

	$: path = (() => {
		let d = '';
		for (const p of points) {
			const v = (p as any)[metric];
			if (typeof v !== 'number') continue;
			const x = xScale(p.timestampMs);
			const y = yScale(v);
			d += d ? ` L ${x} ${y}` : `M ${x} ${y}`;
		}
		return d || '';
	})();

	const TICKS = 4;
	const tfmt = (ms: number) => new Date(ms).toLocaleTimeString();
	const nfmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : '');

	$: xticks = Array.from({ length: TICKS + 1 }, (_, i) => xmin + (i * spanx) / TICKS);
	$: yticks = Array.from({ length: TICKS + 1 }, (_, i) => ymin + (i * spany) / TICKS);
	$: valid = points.filter((p) => typeof (p as any)[metric] === 'number');
	$: N = valid.length;

	const countFromTime = (t: number) => {
		const p = spanx ? (t - xmin) / spanx : 0; // 0..1 along the time span
		return Math.round(1 + p * Math.max(0, N - 1));
	};

	const xfmt = (t: number) => String(countFromTime(t));
</script>

<svg
	viewBox={`0 0 ${W} ${H}`}
	class="mx-auto block h-[240px] w-full rounded-md border bg-background md:h-[280px]"
	style="overflow: visible"
	preserveAspectRatio="xMidYMid meet"
>
	<!-- axes -->
	<line
		x1={PL}
		y1={PT + innerH}
		x2={PL + innerW}
		y2={PT + innerH}
		stroke="currentColor"
		stroke-width="1"
	/>
	<line x1={PL} y1={PT} x2={PL} y2={PT + innerH} stroke="currentColor" stroke-width="1" />

	{#each xticks as t, i}
		<line
			x1={xScale(t)}
			y1={PT + innerH}
			x2={xScale(t)}
			y2={PT + innerH + 6}
			stroke="currentColor"
		/>
		<!-- anchor first/last to avoid clipping -->
		{#if i === 0}
			<text
				x={xScale(t) + 2}
				y={PT + innerH + 18}
				text-anchor="start"
				class="fill-current text-[10px]">{xfmt(t)}</text
			>
		{:else if i === xticks.length - 1}
			<text
				x={xScale(t) - 2}
				y={PT + innerH + 18}
				text-anchor="end"
				class="fill-current text-[10px]">{xfmt(t)}</text
			>
		{:else}
			<text x={xScale(t)} y={PT + innerH + 18} text-anchor="middle" class="fill-current text-[10px]"
				>{xfmt(t)}</text
			>
		{/if}
	{/each}

	<!-- y ticks + grid -->
	{#each yticks as v, j}
		<line x1={PL - 6} y1={yScale(v)} x2={PL} y2={yScale(v)} stroke="currentColor" />
		<!-- nudge top/bottom labels inside the box -->
		<text
			x={PL - 10}
			y={yScale(v) + (j === 0 ? 10 : j === yticks.length - 1 ? -2 : 3)}
			text-anchor="end"
			class="fill-current text-[10px]"
		>
			{nfmt(v)}
		</text>
		<line
			x1={PL}
			y1={yScale(v)}
			x2={PL + innerW}
			y2={yScale(v)}
			stroke="currentColor"
			stroke-opacity="0.1"
		/>
	{/each}

	<!-- data -->
	{#if path}
		<path d={path} fill="none" stroke="currentColor" stroke-width="2" />
	{:else}
		<text x="50%" y="50%" text-anchor="middle" class="text-sm">No data</text>
	{/if}

	<!-- title -->
	<text x={PL + innerW / 2} y={16} text-anchor="middle" class="fill-current text-sm font-medium">
		{metric} over time
	</text>
</svg>
