import { API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	const payload = await request.json();
	const user = locals.user;

	if (!user) {
		throw redirect(303, `/auth/login`);
	}

	let userId = user.userId;

	if (!userId) {
		throw redirect(303, `/auth/login`);
	}

	const res = await fetch(`${API_URL}/onion/tags/add`, {
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
	const payload = await request.json();
	const user = locals.user;

	if (!user) {
		throw redirect(303, `/auth/login`);
	}

	let userId = user.userId;

	if (!userId) {
		throw redirect(303, `/auth/login`);
	}

	const res = await fetch(`${API_URL}/onion/tags/remove`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...payload, userId })
	});

	const data = await res.json();

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
