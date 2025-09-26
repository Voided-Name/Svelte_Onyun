import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data, params }) => {
	await parent();
	return {
		...data,
		breadcrumbs: [
			{ label: 'Onion Samples', href: '/app/data' },
			{ label: `Sample ${params.sampleId}`, href: `/onion/${params.sampleId}` }
		]
	};
};
