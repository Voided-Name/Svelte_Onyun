<script lang="ts">
	import type { PageLoad } from './$types';
	import type { Device } from '$lib/types/device';
	import type { Tag } from '$lib/types/tag';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card/index.js';

	interface PageData {
		devices: Device[];
		tags: Tag[];
		apiUrl: string;
		breadcrumbs: any[];
	}

	export const load: PageLoad = () => ({
		breadcrumbs: [{ label: 'Capture Data' }]
	});

	let { data }: { data: PageData } = $props();
	let devices = $state<Device[]>(data.devices ?? []);
	let tags = $state<Tag[]>(data.tags ?? []);
	let isCapturing = $state(false);
	let deviceSelected = $state('');
	let tagSelected = $state<number | null>(null);
	let lastRequestId = $state<string | null>(null);
	let devicesVisible = $state(false);

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

	function selectTag(tagId: number) {
		tagSelected = tagId;
	}

	async function captureData() {
		if (!deviceSelected || isCapturing) return;
		isCapturing = true;
		lastRequestId = null;

		try {
			const res = await fetch(`${data.apiUrl}/device/${deviceSelected}/scan`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ publicId: deviceSelected, tagId: tagSelected })
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
	const canCapture = $derived(!!deviceSelected && !!tagSelected && !isCapturing);
</script>

{#if !devices.length}
	<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
		<img src={offline} alt="No Devices" class="mt-4 h-40 w-40 opacity-70" />
		<h2 class="text-xl font-semibold text-muted-foreground">No Online Device</h2>
		<p class="text-sm text-muted-foreground">Connect a device to start capturing data.</p>
	</div>
{:else}
	<div class="mx-auto max-w-6xl space-y-6 p-5">
		<!-- Header -->
		<Card.Root>
			<Card.Header class="pb-2">
				<div class="flex items-start justify-between gap-4">
					<div>
						<Card.Title class="mb-1 text-3xl">Capture Data</Card.Title>
						<Card.Description>Select a device and a tag</Card.Description>
					</div>

					{#if isCapturing}
						<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
							Capturing…
						</span>
					{:else if lastRequestId}
						<span class="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
							Req: {lastRequestId}
						</span>
					{/if}
				</div>
			</Card.Header>
		</Card.Root>

		<!-- Pickers -->
		<div class="grid gap-6 md:grid-cols-2">
			<!-- Devices -->
			<Card.Root>
				<Card.Header class="pb-3">
					<Card.Title class="text-lg">Device</Card.Title>
				</Card.Header>
				<Card.Content class="pt-0">
					<div class="max-h-72 space-y-2 overflow-auto pr-1">
						{#each devices as d (d.id)}
							<Button
								onclick={() => selectDevice(d.publicId)}
								variant={deviceSelected === d.publicId ? 'default' : 'outline'}
								class="w-full justify-between"
								aria-pressed={deviceSelected === d.publicId}
							>
								<span class="truncate">{d.displayName}</span>
								{#if deviceSelected === d.publicId}
									<span class="text-xs opacity-80">Selected</span>
								{/if}
							</Button>
							<div
								class="-mt-1 ml-1 text-[13px] {deviceSelected == d.publicId
									? 'text-foreground'
									: 'text-muted-foreground'}"
							>
								<p>Loc: {d.locationTag}</p>
								<p>Created: {d.createdAt}</p>
								<p>Description: {d.description}</p>
							</div>
							{#if d.description}{/if}
							<hr />
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Tags -->
			<Card.Root>
				<Card.Header class="pb-3">
					<Card.Title class="text-lg">Tag</Card.Title>
				</Card.Header>
				<Card.Content class="pt-0">
					<div class="max-h-72 space-y-2 overflow-auto pr-1">
						{#each tags as t (t.tagId)}
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
		</div>

		<!-- Footer / CTA -->
		<div class="flex items-center justify-end gap-3">
			<Button
				variant="outline"
				onclick={() => {
					deviceSelected = '';
					tagSelected = null;
				}}
			>
				Clear
			</Button>
			<Button size="lg" class="min-w-40" disabled={!canCapture} onclick={captureData}>
				{isCapturing ? 'Capturing…' : 'Capture Data'}
			</Button>
		</div>
	</div>
{/if}
