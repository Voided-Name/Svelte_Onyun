<script lang="ts">
	import { type Device } from '$lib/types/device';
	import DeviceCard from '$lib/components/device-card.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';
	import DeviceRegister from '$lib/components/device-register.svelte';

	interface PageData {
		devices: Device[];
		apiUrl: string;
		breadcrumbs: any[];
	}

	let userId = $derived(page.data.userId);

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

	let { data }: { data: PageData } = $props();
	$inspect(presMap);
</script>

<div class="m-5">
	<div class="mb-3 w-fit">
		<DeviceRegister {userId} />
	</div>
	{#if data.devices}
		{#if !data.devices.length}
			<p class="text-sm text-muted-foreground">No devices found.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each data.devices as device (device.id)}
					<DeviceCard {device} status={statusOf(device.publicId)} {userId} />
				{/each}
			</div>
		{/if}
	{/if}
</div>
