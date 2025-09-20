import { writable } from 'svelte/store';

export type Presence = { id: string; online: boolean; last_seen: number };
export const presence = writable<Record<string, Presence>>({});

let timer: any;

export function startPresencePolling(apiUrl: string, intervalMs = 10_000) {
	stopPresencePolling();
	const tick = async () => {
		try {
			const res = await fetch(`${apiUrl}/device/presence`, { cache: 'no-store' });
			if (!res.ok) return;
			const list: Presence[] = await res.json();
			const map: Record<string, Presence> = {};
			for (const p of list) map[p.id] = p;
			presence.set(map);
		} catch {}
	};
	tick();
	timer = setInterval(tick, intervalMs);
}

export function stopPresencePolling() {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
}
