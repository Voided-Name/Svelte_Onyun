import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals }) => {
	return new Response(JSON.stringify({ authenticated: !!locals.user }), {
		headers: { 'content-type': 'application/json' }
	});
};
