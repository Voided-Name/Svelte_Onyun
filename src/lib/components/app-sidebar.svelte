<script lang="ts" module>
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import Tags from '@lucide/svelte/icons/tags';
	import Focus from '@lucide/svelte/icons/focus';
	import HardDrive from '@lucide/svelte/icons/hard-drive';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import PieChartIcon from '@lucide/svelte/icons/pie-chart';
	import MapIcon from '@lucide/svelte/icons/map';
	import LogOut from '@lucide/svelte/icons/log-out';
	import CommandIcon from '@lucide/svelte/icons/command';
	import Tractor from '@lucide/svelte/icons/tractor';
	import Logs from '@lucide/svelte/icons/logs';
	import ClipboardList from '@lucide/svelte/icons/clipboard-list';
	import Settings from '@lucide/svelte/icons/settings';

	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		navMain: [
			{
				title: 'Dashboard',
				url: '/app/dashboard',
				icon: PieChartIcon
			},
			{
				title: 'Device Management',
				url: '/app/manageDevice',
				icon: HardDrive
			},
			{
				title: 'Capture Data',
				url: '/app/captureData',
				icon: Focus
			},
			{
				title: 'Tags',
				url: '/app/tags',
				icon: Tags
			},
			{
				title: 'Data',
				url: '/app/data',
				icon: Tractor
			},
			{
				title: 'System Logs',
				url: '/app/systemLogs',
				icon: Logs
			},
			{
				title: 'Generate System Report',
				url: '/app/generateReport',
				icon: ClipboardList
			}
		],
		navSecondary: [
			{
				title: 'Log Out',
				url: '/auth/logout',
				icon: LogOut
			}
		],
		projects: [
			{
				name: 'Design Engineering',
				url: '#',
				icon: FrameIcon
			},
			{
				name: 'Sales & Marketing',
				url: '#',
				icon: PieChartIcon
			},
			{
				name: 'Travel',
				url: '#',
				icon: MapIcon
			}
		]
	};
</script>

<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
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
		<NavMain items={data.navMain} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<!-- <NavUser user={data.user} /> -->
	</Sidebar.Footer>
</Sidebar.Root>
