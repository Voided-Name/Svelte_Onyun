import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { Device } from '$lib/types/device';
import type { Tag } from '$lib/types/tag';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${API_URL}/device/view/online`);

	if (!response.ok) {
		throw error(response.status, 'Failed to load devices');
	}

	const body = await response.json();
	const devices: Device[] = body?.devices ?? [];

	//console.log('Devices: ', devices);

	const response2 = await fetch(`${API_URL}/onion/tags/view`);

	if (!response2.ok) {
		throw error(response.status, 'Failed to load devices');
	}

	const body2 = await response2.json();
	const tags: Tag[] = body2?.tags ?? [];

	//console.log('Tags: ', tags);

	return { devices, apiUrl: API_URL, tags };
};
