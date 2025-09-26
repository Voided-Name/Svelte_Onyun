<script lang="ts">
	import SidebarIcon from '@lucide/svelte/icons/sidebar';
	import SearchForm from './search-form.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { breadcrumbs }: { breadcrumbs: any[] } = $props();
	const sidebar = Sidebar.useSidebar();
</script>

<header class="sticky top-0 z-50 flex w-full items-center border-b bg-background">
	<div class="flex h-(--header-height) w-full items-center gap-2 px-4">
		<Button class="size-8" variant="ghost" size="icon" onclick={sidebar.toggle}>
			<SidebarIcon />
		</Button>
		<Separator orientation="vertical" class="mr-2 h-4" />
		{#if breadcrumbs.length}
			<Breadcrumb.Root class="hidden sm:block">
				<Breadcrumb.List>
					{#each breadcrumbs as c, i}
						<Breadcrumb.Item>
							{#if c.href && i < breadcrumbs.length - 1}
								<Breadcrumb.Link href={c.href}>{c.label}</Breadcrumb.Link>
							{:else}
								<Breadcrumb.Page>{c.label}</Breadcrumb.Page>
							{/if}
						</Breadcrumb.Item>
						{#if i < breadcrumbs.length - 1}
							<Breadcrumb.Separator />
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		{/if}
		<SearchForm class="w-full sm:ml-auto sm:w-auto" />
	</div>
</header>
