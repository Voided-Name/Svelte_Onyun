<!-- src/lib/components/Math.svelte -->
<script lang="ts">
	import katex from 'katex';

	type Props = {
		expr: string;
		display?: boolean;
		options?: katex.KatexOptions;
	};

	const { expr, display = false, options = {} } = $props<Props>();
	let html = $state('');

	$effect(() => {
		html = katex.renderToString(expr, {
			displayMode: display,
			throwOnError: false,
			strict: 'ignore',
			output: 'mathml',
			...options
		});
	});
</script>

<svelte:element this={display ? 'div' : 'span'}>
	{@html html}
</svelte:element>
