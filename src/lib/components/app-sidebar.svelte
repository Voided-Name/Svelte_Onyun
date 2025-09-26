<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import type { NavItem } from '$lib/nav';
	import { ICONS } from '$lib/icons';
	import Settings from '@lucide/svelte/icons/settings';
	import LogOut from '@lucide/svelte/icons/log-out';

	let {
		items = [],
		ref = $bindable(null),
		...restProps
	} = $props<{ items?: NavItem[] } & ComponentProps<typeof Sidebar.Root>>();
</script>

<Sidebar.Root class="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
							>
								<Settings class="size-4" />
							</div>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-medium">Onyun!</span>
								<span class="truncate text-xs">NEUST</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain {items} />
		<NavSecondary
			items={[{ title: 'Log Out', url: '/auth/logout', icon: LogOut }]}
			class="mt-auto"
		/>
	</Sidebar.Content>
	<Sidebar.Footer>
		<!-- <NavUser user={data.user} /> -->
	</Sidebar.Footer>
</Sidebar.Root>
