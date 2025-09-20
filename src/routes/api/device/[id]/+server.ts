import { API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';
import { page } from '$app/state';
import { redirect } from '@sveltejs/kit';

let userId = page.data.userId;

export const PATCH: RequestHandler = async ({ request }) => {
	const payload = await request.json();

	if (!userId) {
		throw redirect(303, `/auth/login`);
	}

	const res = await fetch(`${API_URL}/device/edit`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});

	const data = await res.json();

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
