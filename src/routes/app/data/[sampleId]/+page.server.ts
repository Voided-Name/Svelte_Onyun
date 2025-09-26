import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import type { SampleDetail } from '$lib/types/onion';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const id = Number(params.sampleId);
	if (!Number.isFinite(id)) throw error(400, 'Invalid sample id');

	const res = await fetch(`${API_URL}/onions/${id}`, { cache: 'no-store' });

	if (res.status === 404) {
		return { notFound: true, sampleId: id };
	}
	if (!res.ok) {
		const msg = await res.text().catch(() => 'Failed to load sample detail');
		throw error(res.status, msg);
	}

	const res2 = await fetch(`${API_URL}/onions/area/${id}`, { cache: 'no-store' });
	const areas = await res2.json();

	const detail: SampleDetail = await res.json();
	return { apiUrl: API_URL, detail, sampleId: id, areas: areas.items[0] };
};
