// src/lib/icons.ts
import PieChart from '@lucide/svelte/icons/pie-chart';
import HardDrive from '@lucide/svelte/icons/hard-drive';
import Users from '@lucide/svelte/icons/users';
import Focus from '@lucide/svelte/icons/focus';
import Tags from '@lucide/svelte/icons/tags';
import Tractor from '@lucide/svelte/icons/tractor';
import Logs from '@lucide/svelte/icons/logs';
import ClipboardList from '@lucide/svelte/icons/clipboard-list';
import Settings from '@lucide/svelte/icons/settings';
import LogOut from '@lucide/svelte/icons/log-out';
import Frame from '@lucide/svelte/icons/frame';
import Map from '@lucide/svelte/icons/map';

export const ICONS = {
	PieChart,
	HardDrive,
	Users,
	Focus,
	Tags,
	Tractor,
	Logs,
	ClipboardList,
	Settings,
	LogOut, // you use this in NavSecondary
	Frame,
	Map
} as const;

export type IconName = keyof typeof ICONS;
