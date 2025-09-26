import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { buildNav } from '$lib/nav';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, `/auth/login?next=${encodeURIComponent(url.pathname + url.search)}`);
	}

	const perms = locals.permissions;

	const nav = buildNav(locals.permissions, locals.user.role);

	return {
		user: { email: locals.user.email, role: locals.user.role, userId: locals.user.userId },
		permissions: Array.from(perms),
		nav
	};
};
