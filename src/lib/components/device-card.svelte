<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import HardDrive from '@lucide/svelte/icons/hard-drive';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import * as Select from '$lib/components/ui/select/index.js';
	import DeviceEditDialog from './device-edit-dialog.svelte';
	import Trash from '@lucide/svelte/icons/trash';
	import Key from '@lucide/svelte/icons/key';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { invalidateAll } from '$app/navigation';

	let { device, status, userId, canManage } = $props();

	let isLoadingCaptive = $state(false);
	let isLoadingLight = $state(false);
	let message = $state('');
	let expiryDays = $state('90');

	const triggerContent = $derived(
		expiryDays === '30'
			? '30 days'
			: expiryDays === '60'
				? '60 days'
				: expiryDays === '90'
					? '90 days'
					: 'Select expiry'
	);

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
				body: JSON.stringify({ publicId, userId })
			});
			if (!res.ok) throw new Error('Network Error');

			const data = await res.json();
			message = data.success === 'success' ? 'Command Sent Successfully' : 'Unexpected Response';

			if (data.status != 'ok') {
				toast.error('Captive Portal Acivation Failed');
			} else {
				toast.success('Captive Portal Activated! Wait for the Access Point to Open');
			}
		} catch (error) {
			console.error('triggerCaptivePortal failed:', error);
			toast.error('Failed to send command');
		} finally {
			isLoadingCaptive = false;
		}
	}

	async function deleteDevice(id: number) {
		try {
			const res = await fetch(`/api/device`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: id,
					userId: userId
				})
			});

			const data = await res.json();
			await invalidateAll();

			console.log(data);
			if (data.success) {
				toast.success('Device Removed Successfully');
			} else {
				if (data.error) {
					if (data.error.message) {
						toast.error(data.error.message);
					}
				}
			}
		} catch (error) {}
	}
</script>

<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title class="flex justify-between">
			<div class="flex">
				<h3 class="mr-2 scroll-m-20 text-2xl font-semibold tracking-tight">
					{device.displayName}
				</h3>
				{#if canManage}
					<DeviceEditDialog {device} {userId} />
				{/if}
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
		{#if canManage}
			<div class="mt-3 grid grid-cols-4 gap-4">
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
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<Button class="col-span-1" variant="secondary" size="icon"><Key /></Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title
								><div class="text-primary">Generate New API Key?</div></AlertDialog.Title
							>
							<AlertDialog.Description
								>This action will change the API key and you will need to re-input the new
								credentials in the device</AlertDialog.Description
							>
							<Select.Root type="single" name="expiryDays" bind:value={expiryDays}>
								<Select.Trigger class="w-[180px]">
									{triggerContent}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="30" label="30">30 days</Select.Item>
									<Select.Item value="60" label="60">60 days</Select.Item>
									<Select.Item value="90" label="90">90 days</Select.Item>
								</Select.Content>
							</Select.Root>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action
								class={buttonVariants({ variant: 'destructive' })}
								onclick={() => deleteDevice(device.id)}>Continue</AlertDialog.Action
							>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<Button class="col-span-1" variant="destructive" size="icon"><Trash /></Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title
								><div class="text-destructive">Are you absolutely sure?</div></AlertDialog.Title
							>
							<AlertDialog.Description>This action is destructive.</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action
								class={buttonVariants({ variant: 'destructive' })}
								onclick={() => deleteDevice(device.id)}>Continue</AlertDialog.Action
							>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
