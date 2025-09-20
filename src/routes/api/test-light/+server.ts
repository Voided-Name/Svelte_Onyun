import { API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';
import { page } from '$app/state';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals, fetch }) => {
	console.log('Runs!');
	const user = locals.user;

	if (!user) {
		throw redirect(303, `/auth/login`);
	}

	const { publicId } = await request.json();

	console.log(`${API_URL}/device/${publicId}/light`);

	const res = await fetch(`${API_URL}/device/${publicId}/light`, {
		method: 'GET'
	});

	const data = await res.json();

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
