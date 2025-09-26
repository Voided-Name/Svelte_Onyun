import { API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { publicId, userId } = await request.json();

	const res = await fetch(`${API_URL}/device/${publicId}/captive-portal`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ publicId, userId: userId })
	});
	const data = await res.json();

	console.log(data);

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
