import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import type { Tag } from '$lib/types/tag';
import type { Account } from '$lib/types/account';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');
	if (!locals.permissions.has('account:manage')) throw error(403, 'Forbidden');

	const res = await fetch(`${API_URL}/accounts/view`);
	if (!res.ok) throw error(res.status, 'Failed to load accounts');
	const data = await res.json();

	console.log(data);

	const items: Account[] = data ?? [];

	return {
		apiUrl: API_URL,
		items,
		breadcrumbs: [{ label: 'Account Management', href: '/manageAccounts' }]
	};
};
