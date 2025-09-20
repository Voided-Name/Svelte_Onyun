<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Pencil from '@lucide/svelte/icons/pencil';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let { device, userId } = $props();

	let displayName = $state(device.displayName);
	let description = $state(device.description);
	let locationTag = $state(device.locationTag);
	let isOpen = $state(false);

	let disabled = $derived(
		displayName === device.displayName &&
			description === device.description &&
			locationTag === device.locationTag
	);

	async function editDevice() {
		try {
			console.log(device);
			const res = await fetch(`/api/device/${device.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					displayName: displayName,
					description: description,
					locationTag: locationTag,
					userId: userId,
					deviceId: device.id
				})
			});

			const data = await res.json();
			await invalidateAll();

			console.log(data);
			if (data.success) {
				toast.success('Device Metadata Updated');
			} else {
				toast.error('Edits not Saved');
			}
		} catch (error) {
		} finally {
			isOpen = false;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		editDevice();
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		<Button variant="secondary" size="icon" aria-label="Edit device">
			<Pencil class="h-4 w-4" />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit {device.displayName}</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="grid gap-3">
				<Label for="displayName">Display Name</Label>
				<Input id="displayName" name="displayName" required bind:value={displayName} />
			</div>
			<div class="grid gap-3">
				<Label for="description">Description</Label>
				<Input id="description" name="description" bind:value={description} />
			</div>
			<div class="grid gap-3">
				<Label for="locationTag">Location</Label>
				<Input id="locationTag" name="locationTag" bind:value={locationTag} />
			</div>
			<Button type="submit" class="w-full" {disabled}>Save Changes</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
