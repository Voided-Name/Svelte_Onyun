import jwt from 'jsonwebtoken';
import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { getAuthToken } from './cookies';

export { setAuthCookie, clearAuthCookies } from './cookies';

export interface JwtPayload {
	userId: number;
	email: string;
	role?: string;
	iat?: number;
	exp?: number;
}
import { JWT_SECRET } from '$env/static/private';

interface TokenResponse {
	success: boolean;
	message?: string;
	user?: Omit<JwtPayload, 'iat' | 'exp'>;
	error?: any;
}

const ACCESS_TOKEN_EXPIRTY = '1h';

export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRTY
	});
};

export const verifyToken = (token: string): TokenResponse => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		return {
			success: true,
			user: {
				userId: decoded.userId,
				email: decoded.email,
				role: decoded.role
			}
		};
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Invalid token',
			error
		};
	}
};

export const authenticateRequest = (cookies: Cookies): TokenResponse => {
	const accessToken = getAuthToken(cookies);

	if (!accessToken) {
		return {
			success: false,
			message: 'No authentication token found'
		};
	}

	return verifyToken(accessToken);
};
