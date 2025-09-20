import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	await parent();
	let { devices, apiUrl } = data;

	return { devices, apiUrl, breadcrumbs: [{ label: 'Device Management' }] };
};
