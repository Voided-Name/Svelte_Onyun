import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	await parent();

	return {
		...data,
		breadcrumbs: [{ label: 'Device Management', href: '/app/manageDevice' }]
	};
};
