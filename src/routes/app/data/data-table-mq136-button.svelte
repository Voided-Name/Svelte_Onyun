<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
	import ArrowUp from '@tabler/icons-svelte/icons/arrow-up';
	import ArrowDown from '@tabler/icons-svelte/icons/arrow-down';
	import { Button } from '$lib/components/ui/button/index.js';

	type Extra = {
		sorted?: false | 'asc' | 'desc';
	};

	let {
		sorted = false,
		variant = 'ghost',
		...restProps
	}: ComponentProps<typeof Button> & Extra = $props();
</script>

<Button {variant} {...restProps}>
	MQ136
	{#if sorted == false}
		<ArrowUpDownIcon class="ml-2" />
	{:else if sorted == 'asc'}
		<ArrowUp class="ml-2" />
	{:else}
		<ArrowDown class="ml-2" />
	{/if}
</Button>
