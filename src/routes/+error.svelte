<!-- src/routes/+error.svelte -->
<script>
	import { page } from '$app/state'; // use $app/stores on older kits
	import cat from '$lib/assets/cat-mouth-open.gif';
	import * as Card from '$lib/components/ui/card/index.js';
	import wip from '$lib/assets/kouji_tokkankouji.png';
	import notFound from '$lib/assets/computer_desktop_bad.png';
</script>

<svelte:head>
	<title>{page.status} — {page.error?.message ?? 'Not found'}</title>
</svelte:head>

<main class="error">
	<img src={notFound} alt="Fried Computer" />
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-9xl">
		{page.status}
	</h1>
	<p class="text-xl leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">
		{page.error?.message ?? 'The page you’re looking for doesn’t exist.'}
	</p>
</main>

<style>
	.error {
		min-height: 100vh; /* fallback */
		min-height: 100dvh; /* correct on mobile browsers */
		display: flex;
		flex-direction: column;
		justify-content: center; /* vertical centering */
		align-items: center; /* horizontal centering */
		gap: 1rem;
		text-align: center;
		padding: 2rem;
	}

	.error img {
		width: min(320px, 60vw);
		height: auto;
		display: block;
	}

	.error h1,
	.error p {
		margin: 0;
	}

	.home {
		display: inline-block;
		padding: 0.6rem 1rem;
		border: 1px solid currentColor;
		border-radius: 0.5rem;
		text-decoration: none;
	}
</style>
