import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

export type LogItem = {
	logId: number;
	loggedAt: string | null; // ISO datetime
	userId: number | null;
	username: string | null;
	deviceId: number | null;
	deviceName: string | null;
	entityType: string | null;
	action: string | null;
	result: string | null;
	description: string | null;
};

export type LogsResponse = {
	total: number;
	items: LogItem[];
};

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	// (optional) server-side auth for this page
	if (!locals.user) throw redirect(303, '/auth/login');
	if (!locals.permissions.has('logs:view')) {
		// use 403 if you prefer: throw error(403, 'Forbidden');
		throw redirect(303, '/app/dashboard');
	}

	// read query params → forward to Flask as-is (with sane defaults)
	const limit = Number(url.searchParams.get('limit') ?? 50);
	const offset = Number(url.searchParams.get('offset') ?? 0);

	const qs = new URLSearchParams({
		limit: String(Math.max(1, Math.min(limit, 500))),
		offset: String(Math.max(0, offset))
	});

	// passthrough optional filters if present
	const forward = [
		'from',
		'to',
		'userId',
		'deviceId',
		'action',
		'entityType',
		'result',
		'q'
	] as const;
	for (const key of forward) {
		const v = url.searchParams.get(key);
		if (v) qs.set(key, v);
	}

	const res = await fetch(`${API_URL}/admin/logs?${qs.toString()}`, { cache: 'no-store' });
	if (!res.ok) throw error(res.status, 'Failed to load system logs');
	const data = (await res.json()) as LogsResponse;

	console.log(data.items);

	return {
		apiUrl: API_URL,
		total: data.total ?? 0,
		items: data.items ?? [],
		// echo current filter state for the client
		filters: Object.fromEntries(url.searchParams.entries())
	};
};
