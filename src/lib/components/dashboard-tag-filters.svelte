<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from './ui/button/button.svelte';
	import DiamondPlus from '@lucide/svelte/icons/diamond-plus';
	import * as Card from '$lib/components/ui/card/index.js';

	let tagSelected = $state<number | null>(null);
	let { tags, tagFilters = $bindable([]) } = $props();
	let isOpen = $state(false);

	function selectTag(tagId: number) {
		tagSelected = tagId;
	}

	function addTag() {
		const next = Array.isArray(tagFilters) ? tagFilters : [];
		if (!next.includes(tagSelected)) {
			tagFilters = [...next, tagSelected];
		}
		tagSelected = null;
		isOpen = false;
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger><Button variant="default"><DiamondPlus />Tag Filter</Button></Dialog.Trigger>
	<Dialog.Content>
		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-lg">Tag</Card.Title>
			</Card.Header>
			<Card.Content class="pt-0">
				<div class="max-h-72 space-y-2 overflow-auto pr-1">
					{#each tags.filter((t) => !(tagFilters ?? []).includes(t.tagId)) as t (t.tagId)}
						<Button
							onclick={() => selectTag(t.tagId)}
							variant={tagSelected === t.tagId ? 'default' : 'outline'}
							class="w-full justify-between"
							aria-pressed={tagSelected === t.tagId}
						>
							<span class="truncate">{t.name}</span>
							{#if tagSelected === t.tagId}
								<span class="text-xs opacity-80">Selected</span>
							{/if}
						</Button>
						<div
							class="-mt-1 ml-1 text-[13px] {tagSelected == t.tagId
								? 'text-foreground'
								: 'text-muted-foreground'}"
						>
							<p>Description: {t.description}</p>
							<p>Created: {t.createdAt}</p>
						</div>
						<hr />
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
		<Button variant="default" onclick={addTag}>Add</Button>
	</Dialog.Content>
</Dialog.Root>
