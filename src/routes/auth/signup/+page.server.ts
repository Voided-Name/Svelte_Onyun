import type { Actions } from './$types';
import { API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

const PASSWORD_POLICY = {
	min: 8,
	max: 64,
	requireUpper: true,
	requireLower: true,
	requireNumber: true
};

function validatePassword(password: string): string | null {
	if (password.length < PASSWORD_POLICY.min) {
		return `Password must be at least ${PASSWORD_POLICY.min} characters long`;
	}
	if (password.length > PASSWORD_POLICY.max) {
		return `Password must not exceed ${PASSWORD_POLICY.max} characters`;
	}
	if (PASSWORD_POLICY.requireUpper && !/[A-Z]/.test(password)) {
		return 'Password must contain at least one uppercase letter';
	}
	if (PASSWORD_POLICY.requireLower && !/[a-z]/.test(password)) {
		return 'Password must contain at least one lowercase letter';
	}
	if (PASSWORD_POLICY.requireNumber && !/[0-9]/.test(password)) {
		return 'Password must contain at least one number';
	}
	return null;
}

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const loginData = {
			username: formData.get('username'),
			password: formData.get('password'),
			token: formData.get('token')
		};

		if (!loginData.password?.toString().trim()) {
			return fail(400, { error: 'Password is required' });
		}

		const passwordError = validatePassword(loginData.password?.toString());
		if (passwordError) {
			return fail(400, { error: passwordError });
		}

		if (!loginData.username || loginData.username?.toString().trim() === '') {
			return fail(400, { error: 'Username is required' });
		}

		if (!loginData.token || loginData.token?.toString().trim() === '') {
			return fail(400, { error: 'Code is required' });
		}

		try {
			const response = await fetch(`${API_URL}/accounts/register_with_token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					password: loginData.password?.toString(),
					username: loginData.username?.toString(),
					token: loginData.token?.toString()
				})
			});

			if (!response.ok) {
				return fail(400, { error: 'Invalid or Expired Token' });
			}

			let data = await response.json();

			if (data.status != 'success') {
				return fail(400, {
					issues: [{ validation: 'register', message: 'Invalid or Expired Token' }]
				});
			}
		} catch (error) {
			console.error('Login Error: ', error);
			return fail(500, {
				message: 'Server Error. Please Try Again Later.'
			});
		}

		cookies.set('flash', 'registered', { path: '/', maxAge: 60, sameSite: 'lax' });
		throw redirect(303, '/auth/login');
	}
} satisfies Actions;
