<script lang="ts">
	import RegisterForm from '$lib/components/register-form.svelte';
	export let form;
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
	<div class="w-full max-w-sm">
		<RegisterForm {form} />
	</div>
</div>
