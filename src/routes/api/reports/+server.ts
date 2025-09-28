import { API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const sp = url.searchParams;
	const payload = {
		from: sp.get('from'), // "2025-09-01" | null
		to: sp.get('to'), // "2025-09-02" | null
		type: sp.get('type'), // "summary" | "comparison" | null
		tagIds: sp.getAll('tagIds').map(Number) // ["3","7"] -> [3,7]
	};

	const upstream = await fetch(`${API_URL}/onion/report`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/pdf'
		},
		body: JSON.stringify(payload)
	});

	if (!upstream.ok) throw error(upstream.status, 'Failed to load report');

	return new Response(upstream.body, {
		status: upstream.status,
		headers: {
			'content-type': upstream.headers.get('content-type') ?? 'application/pdf',
			'content-disposition':
				upstream.headers.get('content-disposition') ?? 'inline; filename="report.pdf"'
		}
	});
};
