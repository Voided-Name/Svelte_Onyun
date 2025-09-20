<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Device } from '$lib/types/device';
	import HardDrive from '@lucide/svelte/icons/hard-drive';
	//export let device: Device;
	//export let status: 'online' | 'offline' = 'offline';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { toast } from 'svelte-sonner';
	import Pencil from '@lucide/svelte/icons/pencil';
	import DeviceEditDialog from './device-edit-dialog.svelte';
	import Trash from '@lucide/svelte/icons/trash';

	let { device, status, userId } = $props();

	let isLoadingCaptive = $state(false);
	let isLoadingLight = $state(false);
	let message = $state('');

	async function triggerTestLight(publicId: string) {
		console.log('Trigger Test Light Step 1');
		isLoadingLight = true;
		message = '';

		try {
			const res = await fetch('/api/test-light', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ publicId, userId })
			});

			const data = await res.json();

			if (data.status != 'ok') {
				toast.error('Light Toggle Failed');
			} else {
				toast.success('Light Toggled Successfully');
			}
		} catch (error) {
			message = 'Failed to send command';
		} finally {
			isLoadingLight = false;
		}
	}

	async function triggerCaptivePortal(publicId: string) {
		isLoadingCaptive = true;
		message = '';

		console.log('Triggered 1');

		try {
			const res = await fetch('/api/captive-portal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ publicId })
			});
			if (!res.ok) throw new Error('Network Error');

			const data = await res.json();
			message = data.success === 'success' ? 'Command Sent Successfully' : 'Unexpected Response';
		} catch (error) {
			console.error('triggerCaptivePortal failed:', error);
			message = 'Failed to send command';
		} finally {
			isLoadingCaptive = false;
		}
	}
</script>

<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title class="flex justify-between">
			<div class="flex">
				<h3 class="mr-2 scroll-m-20 text-2xl font-semibold tracking-tight">
					{device.displayName}
				</h3>
				<DeviceEditDialog {device} {userId} />
			</div>
			{#if status == 'online'}
				<Badge variant="success">Online</Badge>
			{:else if status == 'offline'}
				<Badge variant="destructive">Offline</Badge>
			{/if}
		</Card.Title>
		{#if device.description}
			<Card.Description>{device.description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content>
		<div class="flex justify-center">
			<HardDrive size={100} />
		</div>
		<p class="mt-3 text-base text-muted-foreground">Location</p>
		<h4 class="scroll-m-20 text-base font-medium tracking-tight">
			{device.locationTag}
		</h4>
		<p class="text-base text-muted-foreground">Sensor</p>
		<h4 class="scroll-m-20 text-base font-medium tracking-tight">
			{device.sensorModel}
		</h4>
		<div class="mt-3 grid grid-cols-5 gap-4">
			<Button
				class="col-span-2"
				variant="default"
				onclick={() => triggerCaptivePortal(device.publicId)}
				disabled={isLoadingCaptive}>{isLoadingCaptive ? 'Loading...' : 'Captive Portal'}</Button
			>
			<Button
				class="col-span-2"
				variant="outline"
				onclick={() => triggerTestLight(device.publicId)}
				disabled={isLoadingLight}>{isLoadingLight ? 'Loading...' : 'Test Light'}</Button
			>
			<Button
				class="col-span-1"
				variant="destructive"
				size="icon"
				onclick={() => triggerTestLight(device.publicId)}
				disabled={isLoadingLight}><Trash /></Button
			>
		</div>
	</Card.Content>
</Card.Root>
