import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { Device } from '$lib/types/device';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${API_URL}/device/view/online`);

	if (!response.ok) {
		throw error(response.status, 'Failed to load devices');
	}

	const body = await response.json();
	const devices: Device[] = body?.devices ?? [];

	console.log('Devices: ', devices);

	return { devices, apiUrl: API_URL };
};
