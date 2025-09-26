<script lang="ts">
	let { tags, tagFilters = $bindable<number[]>([]) } = $props();
	const hasTag = (id: number) => Array.isArray(tagFilters) && tagFilters.includes(id);
	import Button from './ui/button/button.svelte';
	import Trash from '@lucide/svelte/icons/trash';

	function removeTag(id: number) {
		// filter out the one we want to remove
		tagFilters = tagFilters.filter((t) => t !== id);
	}
</script>

<div class="grid [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))] gap-3">
	{#each tags as t (t.tagId)}
		{#if hasTag(t.tagId)}
			<div class="rounded border p-3 shadow-sm transition hover:shadow dark:rounded dark:bg-accent">
				<div class="grid grid-cols-4">
					<div class="col-span-3 flex items-center justify-between gap-2">
						<span class="truncate font-medium">{t.name}</span>
					</div>
					<Button class="col-span-1" variant="destructive" onclick={() => removeTag(t.tagId)}
						><Trash /></Button
					>
				</div>
				{#if t.description}
					<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
				{/if}
				<div></div>
			</div>
		{/if}
	{/each}
</div>
