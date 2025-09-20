import { authenticateRequest } from '$lib/auth/jwt';
import { clearAuthCookies } from '$lib/auth/jwt';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import type { JwtPayload } from '$lib/auth/jwt';

declare global {
	namespace App {
		interface Locals {
			user?: Omit<JwtPayload, 'iat' | 'exp'>;
		}
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, url } = event;
	const publicRoutes = ['/auth/signup', '/auth/logout', '/auth/login'];

	const isPublicRoute = publicRoutes.some(
		(route) => url.pathname === route || url.pathname.startsWith('/api/public/')
	);

	const authResult = authenticateRequest(cookies);

	if (authResult.success && authResult.user) {
		event.locals.user = authResult.user;

		if (!cookies.get('user')) {
			cookies.set('user', JSON.stringify(authResult.user), {
				path: '/',
				httpOnly: true
			});
		}

		if (isPublicRoute && url.pathname !== '/auth/logout') {
			return Response.redirect(new URL('/app/dashboard', url));
		} else if (url.pathname == '/') {
			return Response.redirect(new URL('/app/dashboard', url));
		}
	} else {
		if (!isPublicRoute) {
			clearAuthCookies(cookies);
			return Response.redirect(new URL('/auth/login', url));
		} else if (url.pathname == '/') {
			clearAuthCookies(cookies);
			return Response.redirect(new URL('/auth/login', url));
		}
	}

	return resolve(event);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const res = await fetch(request);
	if (res.status === 401) {
		clearAuthCookies(event.cookies);
	}
	return res;
};
