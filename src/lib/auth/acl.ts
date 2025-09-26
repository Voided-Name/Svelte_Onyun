export type Role = 'admin' | 'regular';
export type Perm =
	| 'dashboard:view'
	| 'device:manage'
	| 'device:view'
	| 'account:manage'
	| 'capture:create'
	| 'tags:crud'
	| 'data:view'
	| 'logs:view'
	| 'report:generate';

export const ROLE_PERMS: Record<Role, Perm[]> = {
	admin: [
		'dashboard:view',
		'device:manage',
		'device:view',
		'account:manage',
		'capture:create',
		'tags:crud',
		'data:view',
		'logs:view',
		'report:generate'
	],
	regular: [
		'dashboard:view',
		'device:view',
		'capture:create',
		'tags:crud',
		'data:view',
		'report:generate'
	]
};

export function permsFor(role?: Role): Set<Perm> {
	return new Set(ROLE_PERMS[role ?? 'regular'] ?? []);
}
export function can(perms: Set<Perm>, needed: Perm | Perm[]) {
	const need = Array.isArray(needed) ? needed : [needed];
	return need.every((p) => perms.has(p));
}
