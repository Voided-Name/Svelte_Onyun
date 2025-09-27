<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let { userId } = $props();

	let isOpen = $state(false);
	let displayName = $state('');
	let locationTag = $state('');
	let description = $state('');
	let expiryDays = $state('90');

	let disabled = $derived(!displayName || !locationTag);

	let showAlert = $state(false);
	let deviceData = $state<{ publicId: string; apiKey: string } | null>(null);

	async function registerDevice() {
		try {
			const res = await fetch(`/api/device`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					displayName: displayName,
					description: description,
					locationTag: locationTag,
					ttlDays: expiryDays,
					userId: userId
				})
			});

			const data = await res.json();
			await invalidateAll();

			console.log(data);
			if (data.id) {
				deviceData = { publicId: data.publicId, apiKey: data.apiKey };
				showAlert = true;
			} else {
				if (data.error) {
					if (data.error.message) {
						toast.error(data.error.message);
					}
				}
			}
		} catch (error) {
		} finally {
			isOpen = false;
			displayName = '';
			locationTag = '';
			description = '';
			expiryDays = '90';
		}
	}

	function onRegister(e: SubmitEvent) {
		e.preventDefault();
		// do something with form values
		registerDevice();
		isOpen = false;
	}

	let value = $state('');

	const triggerContent = $derived(
		expiryDays === '30'
			? '30 days'
			: expiryDays === '60'
				? '60 days'
				: expiryDays === '90'
					? '90 days'
					: 'Select expiry'
	);
</script>

<AlertDialog.Root bind:open={showAlert}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Device Registered</AlertDialog.Title>
			<AlertDialog.Description>Please copy your API Key before closing.</AlertDialog.Description>
		</AlertDialog.Header>

		{#if deviceData}
			<p><strong>Device ID:</strong> {deviceData.publicId}</p>
			<p><strong>API Key:</strong> {deviceData.apiKey}</p>
		{/if}

		<AlertDialog.Footer>
			<Button onclick={() => deviceData && navigator.clipboard.writeText(deviceData.apiKey)}
				>Copy</Button
			>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Register Device</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add</Dialog.Title>
			<Dialog.Description>Register New Device</Dialog.Description>
		</Dialog.Header>

		<form class="grid gap-4 py-2" onsubmit={onRegister}>
			<div class="grid gap-2">
				<Label for="displayName">Display Name</Label>
				<Input id="displayName" bind:value={displayName} />
			</div>

			<div class="grid gap-2">
				<Label for="locationTag">Location Tag</Label>
				<Input id="locationTag" bind:value={locationTag} />
			</div>

			<div class="grid gap-2">
				<Label for="description">Description (optional)</Label>
				<Input id="description" bind:value={description} />
			</div>

			<div class="grid gap-2">
				<Label>API Key Expiry</Label>
				<Select.Root type="single" name="favoriteFruit" bind:value={expiryDays}>
					<Select.Trigger class="w-[180px]">
						{triggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="30" label="30">30 days</Select.Item>
						<Select.Item value="60" label="60">60 days</Select.Item>
						<Select.Item value="90" label="90">90 days</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<Dialog.Footer class="flex gap-2">
				<Dialog.Close>
					<Button type="button" variant="secondary">Close</Button>
				</Dialog.Close>
				<Button type="submit" {disabled}>Register</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
