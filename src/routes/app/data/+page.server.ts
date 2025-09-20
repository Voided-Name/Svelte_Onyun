import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import type { SampleSummary } from '$lib/types/onion';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${API_URL}/onions/list?limit=500`);
	if (!res.ok) throw error(res.status, 'Failed to load onion samples');
	const data = await res.json();

	console.log(data);

	const items: SampleSummary[] = data?.items ?? [];
	return { apiUrl: API_URL, items };
};
