import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, `/auth/login?next=${encodeURIComponent(url.pathname + url.search)}`);
	}
	return {
		userId: locals.user?.userId
	};
};
