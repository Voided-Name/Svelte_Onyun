// src/hooks.server.ts
import { authenticateRequest, clearAuthCookies } from '$lib/auth/jwt';
import { permsFor, type Role, type Perm } from '$lib/auth/acl';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import type { JwtPayload } from '$lib/auth/jwt';

type AuthUser = Omit<JwtPayload, 'iat' | 'exp' | 'role'> & { role?: Role };

declare global {
	namespace App {
		interface Locals {
			user?: AuthUser;
			permissions: Set<Perm>;
		}
		interface PageData {
			user?: AuthUser;
			permissions?: Perm[]; // serialized to client in +layout.server.ts if needed
		}
	}
}

function toRole(value: unknown): Role | undefined {
	return value === 'admin' || value === 'regular' ? value : undefined;
}

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, url } = event;

	const publicRoutes = ['/auth/signup', '/auth/logout', '/auth/login'];
	const isPublicRoute =
		publicRoutes.some((route) => url.pathname === route) || url.pathname.startsWith('/api/public/');

	const authResult = authenticateRequest(cookies);

	if (authResult.success && authResult.user) {
		const role = toRole(authResult.user.role);
		const user: AuthUser = { ...authResult.user, role };

		event.locals.user = user;
		event.locals.permissions = permsFor(role);

		// Redirect authenticated users away from public auth pages and root
		if (isPublicRoute && url.pathname !== '/auth/logout') {
			return Response.redirect(new URL('/app/dashboard', url));
		}
		if (url.pathname === '/') {
			return Response.redirect(new URL('/app/dashboard', url));
		}
	} else {
		// Unauthenticated: clear, zero permissions, and gate non-public routes
		event.locals.user = undefined;
		event.locals.permissions = new Set<Perm>();

		if (!isPublicRoute || url.pathname === '/') {
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
