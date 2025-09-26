import type { Perm } from '$lib/auth/acl';
import type { Role } from '$lib/auth/acl';
import type { IconName } from './icons';

export type NavItem = {
	title: string;
	url: string;
	icon: IconName; // keep as string; resolve to component in the sidebar
	requires: Perm[];
};

export type ResolvedNavItem = {
	title: string;
	url: string;
	icon:
		| 'PieChart'
		| 'HardDrive'
		| 'Users'
		| 'Focus'
		| 'Tags'
		| 'Tractor'
		| 'Logs'
		| 'ClipboardList';
};

export function buildNav(perms: Set<Perm>, role?: Role): ResolvedNavItem[] {
	const items: ResolvedNavItem[] = [];

	if (perms.has('dashboard:view'))
		items.push({ title: 'Dashboard', url: '/app/dashboard', icon: 'PieChart' });
	if (perms.has('device:manage')) {
		items.push({ title: 'Device Management', url: '/app/manageDevice', icon: 'HardDrive' });
	} else if (perms.has('device:view')) {
		items.push({ title: 'Devices', url: '/app/manageDevice', icon: 'HardDrive' });
	}

	if (perms.has('account:manage'))
		items.push({ title: 'Account Management', url: '/app/manageAccounts', icon: 'Users' });

	if (perms.has('capture:create'))
		items.push({ title: 'Capture Data', url: '/app/captureData', icon: 'Focus' });

	if (perms.has('tags:crud')) items.push({ title: 'Tags', url: '/app/tags', icon: 'Tags' });

	if (perms.has('data:view')) items.push({ title: 'Data', url: '/app/data', icon: 'Tractor' });

	if (perms.has('logs:view'))
		items.push({ title: 'System Logs', url: '/app/systemLogs', icon: 'Logs' });

	if (perms.has('report:generate'))
		items.push({
			title: 'Generate Report',
			url: '/app/generateReport',
			icon: 'ClipboardList'
		});

	return items;
}
