<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import SiteHeader from '$lib/components/site-header.svelte';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	$inspect(page.data.breadcrumbs);

	let interval: number;
	onMount(() => {
		interval = window.setInterval(async () => {
			const res = await fetch('/auth/session');

			console.log(res);

			if (res.redirected || new URL(res.url).pathname !== '/auth/session') {
				goto('/auth/login');
				toast.warning('Session Expired', { duration: Infinity });
				return;
			}

			if (res.type === 'basic' && res.redirected) {
				goto('/auth/login');
				toast.warning('Session Expired', { duration: Infinity });

				return;
			}

			if (res.ok) {
				const { authenticated } = await res.json();
				if (!authenticated) goto('/auth/login');
			}
		}, 5_000); // every minute
		return () => clearInterval(interval);
	});

	let { children } = $props();
</script>

<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col">
		<SiteHeader breadcrumbs={page.data.breadcrumbs ?? []} />
		<div class="flex flex-1">
			<AppSidebar items={page.data.nav} />
			<Sidebar.Inset>
				{@render children?.()}
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
