export interface SampleSummary {
	sampleId: number;
	count: number;
	startedAt: string | null;
	tagName: string | null;
	tagId: number;
	endedAt: string | null;
	sentAt: string;
	durationSec: number | null;
	avgTemp?: number | null;
	avgHumidity?: number | null;
	areaMq135?: number | null;
	areaMq136?: number | null;
	areaMq137?: number | null;
	areaMq138?: number | null;
	areaMq135Corr?: number | null;
	areaMq136Corr?: number | null;
	areaMq137Corr?: number | null;
	areaMq138Corr?: number | null;
	spoiled: boolean;
	spoilProb: number;
}

export interface SamplePoint {
	timestampMs: number;
	t: string; // ISO
	temperature?: number | null;
	humidity?: number | null;
	mq135?: number | null;
	mq136?: number | null;
	mq137?: number | null;
	mq138?: number | null;
}

export interface SampleDetail {
	sampleId: number;
	count: number;
	startedAt: string;
	endedAt: string;
	points: SamplePoint[];
}
