import { API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';
import { page } from '$app/state';
import { redirect, error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	if (!locals.permissions.has('account:manage')) throw error(403, 'Forbidden');

	const payload = await request.json();
	const user = locals.user;

	if (!user) {
		throw redirect(303, `/auth/login`);
	}

	let userId = user.userId;

	if (!userId) {
		throw redirect(303, `/auth/login`);
	}

	const res = await fetch(`${API_URL}/device/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});

	const data = await res.json();

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	if (!locals.permissions.has('account:manage')) throw error(403, 'Forbidden');

	const payload = await request.json();
	const user = locals.user;

	if (!user) {
		throw redirect(303, `/auth/login`);
	}

	let userId = user.userId;

	if (!userId) {
		throw redirect(303, `/auth/login`);
	}

	const res = await fetch(`${API_URL}/device/delete`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});

	const data = await res.json();

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
