<script lang="ts">
	import type { PageLoad } from './$types';

	export const load: PageLoad = () => ({
		breadcrumbs: [
			{ label: 'Dashboard' } // last item is the current page; omit href
		]
	});
</script>

Dashboard
