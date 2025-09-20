import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { clearAuthCookies } from '$lib/auth/jwt';

export const load: PageServerLoad = async ({ cookies }) => {
	clearAuthCookies(cookies);

	throw redirect(303, '/auth/login');
};

export const actions = {
	default: async ({ cookies }) => {
		clearAuthCookies(cookies);

		throw redirect(303, '/auth/login');
	}
} satisfies Actions;
