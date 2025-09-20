import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	secure: !dev,
	sameSite: 'strict' as const,
	maxAge: 60 * 60
};

export const setAuthCookie = (cookies: Cookies, accessToken: string): void => {
	cookies.set('access_token', accessToken, COOKIE_OPTIONS);
};

export const clearAuthCookies = (cookies: Cookies): void => {
	cookies.delete('access_token', { path: '/' });
	cookies.delete('user', { path: '/' });
};

export const getAuthToken = (cookies: Cookies): string | undefined => {
	return cookies.get('access_token');
};
