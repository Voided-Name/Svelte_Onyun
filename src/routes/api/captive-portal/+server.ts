import { API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { publicId } = await request.json();

	console.log(`${API_URL}/device/${publicId}/captive-portal`);

	const res = await fetch(`${API_URL}/device/${publicId}/captive-portal`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ publicId })
	});
	const data = await res.json();

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
