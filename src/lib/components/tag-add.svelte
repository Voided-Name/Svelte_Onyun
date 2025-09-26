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
	let name = $state('');
	let description = $state('');

	let disabled = $derived(!name || !description);

	let showAlert = $state(false);
	let deviceData = $state<{ publicId: string; apiKey: string } | null>(null);

	async function addTag() {
		try {
			const res = await fetch(`/api/tag`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: name,
					description: description,
					userId: userId
				})
			});

			const data = await res.json();
			await invalidateAll();

			// console.log(data);
			// console.log(data.error);

			if (data.status == 'success') {
				toast.success('Tag Added!');
			} else if (data.error) {
				console.log(data.error);
				if (data.error.type == 'tag_exists') {
					toast.error(data.error.message);
				}
			} else {
				toast.error('Failed. Something Went Wrong!');
			}
		} catch (error) {
		} finally {
			isOpen = false;
			name = '';
			description = '';
		}
	}

	function onRegister(e: SubmitEvent) {
		e.preventDefault();
		addTag();
		isOpen = false;
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Create New Tag</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add</Dialog.Title>
			<Dialog.Description>Add New Tag</Dialog.Description>
		</Dialog.Header>

		<form class="grid gap-4 py-2" onsubmit={onRegister}>
			<div class="grid gap-2">
				<Label for="name">Name</Label>
				<Input id="name" bind:value={name} />
			</div>
			<div class="grid gap-2">
				<Label for="description">Description</Label>
				<Input id="description" bind:value={description} />
			</div>

			<Dialog.Footer class="flex gap-2">
				<Dialog.Close>
					<Button type="button" variant="secondary">Close</Button>
				</Dialog.Close>
				<Button type="submit" {disabled}>Add</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
