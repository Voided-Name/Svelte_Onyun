import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { Device } from '$lib/types/device';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');

	const canView = locals.permissions.has('device:view') || locals.permissions.has('device:manage');
	if (!canView) throw error(403, 'Forbidden');

	const response = await fetch(`${API_URL}/device/view`);

	if (!response.ok) {
		throw error(response.status, 'Failed to load devices');
	}

	const body = await response.json();
	const devices: Device[] = body?.devices ?? [];

	console.log('Devices: ', devices);

	return {
		userId: locals.user.userId,
		devices,
		apiUrl: API_URL,
		permissions: Array.from(locals.permissions)
	};
};
