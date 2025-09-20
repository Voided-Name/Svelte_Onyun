import type { PageLoad } from './$types';

export const load: PageLoad = () => ({
	breadcrumbs: [{ label: 'Dashboard' }]
});
