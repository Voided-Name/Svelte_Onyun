<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	// export let form;
	//  export let data: { flash?: string };
	let { form, data } = $props();
	import { toast } from 'svelte-sonner';

	$effect(() => {
		if (data.flash === 'registered') {
			toast.success('Account created. You can now sign in.');
		}
	});
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
	<div class="w-full max-w-sm">
		<LoginForm {form} />
	</div>
</div>
