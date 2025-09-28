import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	await parent();
	return {
		...data,
		breadcrumbs: [{ label: 'Generate Report', href: '/app/generateReport' }]
	};
};
