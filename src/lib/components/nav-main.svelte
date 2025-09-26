<script lang="ts">
	import type { Component } from 'svelte';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import type { NavItem } from '$lib/nav';
	import type { IconName } from '$lib/icons';
	import type { Perm } from '$lib/auth/acl';
	import { ICONS } from '$lib/icons';

	let { items = [] } = $props<{ items?: NavItem[] }>();
</script>

<Sidebar.Group>
	{#each items as item}
		{@const Icon = ICONS[item.icon]}
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={item.url} {...props}>
							{#if Icon}
								<svelte:component this={Icon} class="size-4" />
							{/if}
							<span>{item.title}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	{/each}
</Sidebar.Group>
