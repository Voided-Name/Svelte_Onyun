<script lang="ts">
	import { type Device } from '$lib/types/device';
	import DeviceCard from '$lib/components/device-card.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';
	import DeviceRegister from '$lib/components/device-register.svelte';
	import type { Perm } from '$lib/auth/acl';

	let { data }: { data: PageData } = $props();

	interface PageData {
		devices: Device[];
		apiUrl: string;
		permissions?: Perm[];
		userId;
		breadcrumbs: any[];
	}

	const presMap = $state<Record<string, { online: boolean; last_seen: number }>>({});

	$effect(() => {
		let stopped = false;
		const tick = async () => {
			try {
				const res = await fetch(`${data.apiUrl}/device/presence`, { cache: 'no-store' });
				if (!res.ok) return;
				const list = (await res.json()) as Array<{
					id: string;
					online: boolean;
					last_seen: number;
				}>;
				if (stopped) return;
				const m: Record<string, { online: boolean; last_seen: number }> = {};
				for (const p of list) m[p.id] = { online: p.online, last_seen: p.last_seen };
				Object.assign(presMap, m);
			} catch {}
		};

		const run = () => {
			tick();
			interval = setInterval(tick, 10_000);
		};
		let interval: any;
		run();

		return () => {
			stopped = true;
			clearInterval(interval);
		};
	});

	const statusOf = (id: string) => (presMap[id]?.online ? 'online' : 'offline');
	const permList = $derived<Perm[]>(
		(page.data.permissions as Perm[] | undefined) ?? (data.permissions as Perm[] | undefined) ?? []
	);
	const perms = $derived(new Set<Perm>(permList));
	const canManage = $derived(perms.has('device:manage'));
	const canView = $derived(canManage || perms.has('device:view'));
</script>

<div class="m-5">
	<div class="mb-3">
		{#if canManage}
			<DeviceRegister userId={data.userId} />
		{/if}
	</div>
	{#if data.devices}
		{#if !data.devices.length}
			<p class="text-sm text-muted-foreground">No devices found.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each data.devices as device (device.id)}
					<DeviceCard
						{device}
						status={statusOf(device.publicId)}
						userId={data.userId}
						{canManage}
					/>
				{/each}
			</div>
		{/if}
	{/if}
</div>
