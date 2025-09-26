<script lang="ts">
	import Orbit from '@lucide/svelte/icons/orbit';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import ZodIssues from './ZodIssues.svelte';

	let {
		ref = $bindable(null),
		class: className,
		form,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { form: any } = $props();
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form method="POST" use:enhance>
		<div class="flex flex-col gap-6">
			<div class="flex flex-col items-center gap-2">
				<a href="##" class="flex flex-col items-center gap-2 font-medium">
					<div class="flex size-8 items-center justify-center rounded-md">
						<Orbit class="size-6" />
					</div>
					<span class="sr-only">ONYUN</span>
				</a>
				<h1 class="text-xl font-bold">Welcome to ONYUN</h1>
				<div class="text-center text-sm">
					Don&apos;t have an account?
					<a href="/auth/signup" class="underline underline-offset-4"> Sign up </a>
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						name="email"
						placeholder="m@example.com"
						required
						class="bg-card"
					/>
				</div>
				<div class="grid gap-3">
					<Label for="password">Password</Label>
					<Input id="password" type="password" name="password" required class="bg-card" />
				</div>
				{#if form?.issues}
					<ZodIssues issues={form.issues} />
				{/if}
				<Button type="submit" class="w-full">Login</Button>
			</div>
		</div>
	</form>
	<div
		class="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary"
	>
		By clicking continue, you agree to our <a href="##">Terms of Service</a>
		and <a href="##">Privacy Policy</a>.
	</div>
</div>
