import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import type { SampleSummary } from '$lib/types/onion';
import { error } from '@sveltejs/kit';
import type { Tag } from '$lib/types/tag';

export const load: PageServerLoad = async ({ fetch }) => {
	const response2 = await fetch(`${API_URL}/onion/tags/view`);

	if (!response2.ok) {
		throw error(response2.status, 'Failed to load tags');
	}

	const body2 = await response2.json();
	const tags: Tag[] = body2?.tags ?? [];

	return { apiUrl: API_URL, tags };
};
