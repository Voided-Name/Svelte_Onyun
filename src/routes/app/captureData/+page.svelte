<script lang="ts">
	import type { PageLoad } from './$types';
	import type { Device } from '$lib/types/device';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card/index.js';

	interface PageData {
		devices: Device[];
		apiUrl: string;
		breadcrumbs: any[];
	}

	export const load: PageLoad = () => ({
		breadcrumbs: [{ label: 'Capture Data' }]
	});

	let { data }: { data: PageData } = $props();
	let devices = $state<Device[]>(data.devices ?? []);
	let isCapturing = $state(false);
	let deviceSelected = $state('');
	let lastRequestId = $state<string | null>(null);

	$effect(() => {
		let interval: any;
		const tick = async () => {
			const res = await fetch(`${data.apiUrl}/device/view/online`, { cache: 'no-store' });
			const json = await res.json();
			devices = json.devices ?? [];
			if (deviceSelected && !devices.some((d) => d.publicId === deviceSelected)) {
				deviceSelected = '';
			}
		};
		tick();
		interval = setInterval(tick, 10_000);
		return () => clearInterval(interval);
	});

	function selectDevice(publicId: string) {
		deviceSelected = publicId;
	}

	async function captureData() {
		if (!deviceSelected || isCapturing) return;
		isCapturing = true;
		lastRequestId = null;

		try {
			const res = await fetch(`${data.apiUrl}/device/${deviceSelected}/scan`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ publicId: deviceSelected })
			});

			const json = await res.json().catch(() => ({}));
			if (!res.ok) {
				toast.error(json?.error ?? 'Capture failed');
				return;
			}

			lastRequestId = json?.request_id ?? null;
			toast.success('Scan command sent (Scanning Takes 3 minutes)', {
				position: 'top-center',
				description: lastRequestId ? `Request ID: ${lastRequestId}` : undefined
			});
		} catch (e) {
			toast.error('Network error while sending scan');
		} finally {
			isCapturing = false;
		}
	}

	import offline from '$lib/assets/undraw_no-signal_nqfa.svg';
	import wip from '$lib/assets/kouji_tokkankouji.png';
</script>

{#if !devices.length}
	<div class="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
		<img src={offline} alt="No Devices" class="mt-4 h-48 w-48 opacity-70" />
		<h2 class="text-xl font-semibold text-muted-foreground">No Online Device</h2>
		<p class="text-sm text-muted-foreground">Connect a device to start capturing data.</p>
	</div>
{:else}
	<div class="m-auto">
		<Card.Root>
			<Card.Header>
				<Card.Title>Capture Data</Card.Title>
				<Card.Description>Select a Device and Tag</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if lastRequestId}
					<p class="text-xs text-muted-foreground">
						Request ID: {lastRequestId}
					</p>
				{/if}

				<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Select Device</h3>

				{#each devices as device (device.id)}
					<Button
						onclick={() => selectDevice(device.publicId)}
						variant={deviceSelected === device.publicId ? 'default' : 'outline'}
					>
						{device.displayName}
					</Button>
				{/each}
				<Button size="lg" disabled={!deviceSelected || isCapturing} onclick={captureData}>
					{isCapturing ? 'Capturing…' : 'Capture Data'}
				</Button>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
