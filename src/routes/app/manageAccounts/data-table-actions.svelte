<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import Command from '@lucide/svelte/icons/command';

	let { id }: { id: string } = $props();

	async function removeTag() {
		try {
			const res = await fetch(`/api/tag`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tagId: id
				})
			});

			const data = await res.json();
			await invalidateAll();

			// console.log(data);
			// console.log(data.error);

			if (data.status == 'success') {
				toast.success('Tag Removed!');
			} else {
				toast.error('Failed. Something Went Wrong!');
			}
		} catch (error) {}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Command />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item onclick={removeTag}>
				<div class="text-red-800 dark:text-red-300">Disable</div>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={removeTag}>
				<div class="text-green-800 dark:text-green-300">Enable</div>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
