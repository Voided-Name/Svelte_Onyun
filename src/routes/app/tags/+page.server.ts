import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import type { Tag } from '$lib/types/tag';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${API_URL}/onion/tags/view`);
	if (!res.ok) throw error(res.status, 'Failed to load onion tags');
	const data = await res.json();

	console.log(data);

	const items: Tag[] = data?.tags ?? [];

	return { apiUrl: API_URL, items, breadcrumbs: [{ label: 'Tags', href: '/tags' }] };
};
