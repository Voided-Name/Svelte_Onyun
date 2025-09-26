<script lang="ts">
	import Orbit from '@lucide/svelte/icons/orbit';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let token = $state('');
	let user = $state('');
	let password = $state('');

	let {
		ref = $bindable(null),
		class: className,
		form,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { form: any } = $props();

	$effect(() => {
		if (form?.error) {
			toast.error(form.error, { position: 'bottom-center' });
		}
		if (form?.success) {
			toast.success(form.success);
		}
	});
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form method="POST" use:enhance>
		<div class="flex flex-col gap-6">
			<div class="flex flex-col items-center gap-2">
				<div class="flex size-8 items-center justify-center rounded-md">
					<Orbit class="size-6" />
				</div>
				<span class="sr-only">ONYUN</span>
				<h1 class="text-xl font-bold">Enter code to join</h1>
				<div class="text-center text-sm">
					Already have an account?
					<a href="/auth/login" class="underline underline-offset-4"> Login </a>
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<div class="grid gap-3">
						<Label for="token">Code</Label>
						<Input
							id="token"
							type="token"
							name="token"
							class="bg-card"
							bind:value={token}
							required
						/>
					</div>
					<Label for="username">Username</Label>
					<Input
						id="username"
						type="username"
						name="username"
						class="bg-card"
						bind:value={user}
						required
					/>
				</div>
				<div class="grid gap-3">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						name="password"
						class="bg-card"
						required
						bind:value={password}
					/>
				</div>
				<Button type="submit" class="w-full" disabled={token == '' || user == '' || password == ''}
					>Continue</Button
				>
			</div>
		</div>
	</form>
	<div
		class="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary"
	></div>
</div>
