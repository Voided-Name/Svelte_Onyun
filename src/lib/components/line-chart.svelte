<script lang="ts">
	import { Chart } from 'chart.js';
	import { onMount } from 'svelte';
	let { title, chartLabels, chartData, dataLabel, onReload } = $props();

	let canvas: HTMLCanvasElement | null = $state(null);
	let chart: Chart | null = null;

	onMount(() => {
		if (canvas) {
			chart = new Chart(canvas, {
				type: 'line',
				data: []
			});
		}
	});

	$effect(() => {
		if (!chart) {
			return;
		}
		chart.data = {
			labels: chartLabels,
			datasets: $state.snapshot([
				{
					label: dataLabel,
					data: chartData
				}
			])
		};
		chart.update();
	});
</script>

<canvas bind:this={canvas}></canvas>
