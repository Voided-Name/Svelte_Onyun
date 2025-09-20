import type { Actions } from './$types';
import { API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { generateToken } from '$lib/auth/jwt';
import { setAuthCookie } from '$lib/auth/jwt';
import { z } from 'zod';

const LoginSchema = z.object({
	email: z.string().email('Please enter a valid email').trim().toLowerCase(),
	password: z.string().min(1, 'Password is required')
});

interface LoginResponse {
	status: string;
	user: {
		id: number;
		username: string;
		userType: string;
	};
}

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const loginData = {
			email: formData.get('email'),
			password: formData.get('password')
		};
		let data: LoginResponse | null = null;
		const safeParse = LoginSchema.safeParse(loginData);

		if (!safeParse.success) {
			console.log('Issues:', safeParse.error.issues);
			return fail(400, { issues: safeParse.error.issues });
		}

		try {
			const response = await fetch(`${API_URL}/accounts/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: loginData.email?.toString(),
					password: loginData.password?.toString()
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return fail(400, { issues: [{ validation: 'login', message: 'Invalid Login Details' }] });
			}

			data = await response.json();
		} catch (error) {
			console.error('Login Error: ', error);
			return fail(500, {
				message: 'Server Error. Please Try Again Later.',
				email: loginData.email?.toString()
			});
		}

		console.log(data);

		if (data) {
			const tokenPayload = {
				userId: data.user.id,
				email: data.user.username,
				role: data.user.userType
			};

			const accessToken = generateToken(tokenPayload);

			setAuthCookie(cookies, accessToken);

			throw redirect(303, '/app/dashboard');
		} else {
			return fail(500, {
				message: 'Server Error. Please Try Again Later.',
				email: loginData.email?.toString()
			});
		}
	}
} satisfies Actions;
