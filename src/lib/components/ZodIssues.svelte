<script lang="ts">
	import type { ZodIssue } from 'zod';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

	let { issues }: { issues: ZodIssue[] } = $props();
</script>

<ul>
	<Alert.Root variant="destructive">
		<AlertCircleIcon />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>
			<ul class="list-inside list-disc text-sm">
				{#each issues as { message }}
					<li>{message}</li>
				{/each}
			</ul>
		</Alert.Description>
	</Alert.Root>
</ul>
