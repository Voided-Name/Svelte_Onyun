<script lang="ts">
	import { type SampleSummary } from '$lib/types/onion';
	import Charts from '$lib/components/bar-chart.svelte';
	import type { Tag } from '$lib/types/tag';

	interface PageData {
		apiUrl: string;
		items: SampleSummary[];
		breadcrumbs: any[];
		tags: Tag[];
	}

	let { data }: { data?: PageData } = $props();
</script>

<div class="m-5">
	{#if data?.items}
		<Charts {data} />
	{/if}
</div>
