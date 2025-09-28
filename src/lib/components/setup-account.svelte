<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { type DateValue } from '@internationalized/date';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import DatePicker from './date-picker.svelte';

	let { userId } = $props();

	let isOpen = $state(false);
	let email = $state('');
	let fName = $state('');
	let lName = $state('');
	let dob = $state<DateValue | undefined>();

	let disabled = $derived(!email || !fName || !lName || !dob);

	async function addAccount() {
		try {
			const dobIso = dob
				? `${String(dob.year).padStart(4, '0')}-${String(dob.month).padStart(2, '0')}-${String(dob.day).padStart(2, '0')}`
				: null;
			const res = await fetch(`/api/account`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: email,
					firstName: fName,
					lastName: lName,
					dateOfBirth: dobIso,
					userId: userId
				})
			});

			const data = await res.json();
			await invalidateAll();

			if (data.status == 'success') {
				toast.success('Token Sent to User!');
			} else if (data.error) {
				toast.error(data.error.message);
			} else {
				toast.error('Failed. Something Went Wrong!');
			}
		} catch (error) {
		} finally {
			isOpen = false;
			fName = '';
			email = '';
			lName = '';
			dob = undefined;
		}
	}

	function onRegister(e: SubmitEvent) {
		e.preventDefault();
		addAccount();
		isOpen = false;
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Setup an Account</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add</Dialog.Title>
			<Dialog.Description>Setup a new account</Dialog.Description>
		</Dialog.Header>

		<form class="grid gap-4 py-2" onsubmit={onRegister}>
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" bind:value={email} type="email" />
			</div>
			<div class="grid gap-2">
				<Label for="fName">First Name</Label>
				<Input id="fName" bind:value={fName} />
			</div>
			<div class="grid gap-2">
				<Label for="lName">Last Name</Label>
				<Input id="lName" bind:value={lName} />
			</div>
			<div class="grid gap-2">
				<DatePicker bind:value={dob} label="Date of Birth" />
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
