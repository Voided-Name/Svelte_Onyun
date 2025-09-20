<script lang="ts">
	export let devices: any[] = [];
	import * as Card from '$lib/components/ui/card/index.js';
</script>

{#if devices.length === 0}
	<p class="m-5 text-sm text-muted-foreground">No devices found.</p>
{:else}
	{#each devices as device}
		<Card.Root class="w-full max-w-sm">
			<Card.Header>
				<Card.Title>device.name</Card.Title>
				<Card.Description>device.description</Card.Description>
			</Card.Header>
			<Card.Content></Card.Content>
		</Card.Root>
	{/each}
{/if}
