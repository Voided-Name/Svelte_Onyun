export interface Device {
	id: number;
	displayName: string;
	description: string;
	createdAt: Date;
	isActive: boolean;
	locationTag: string;
	status: number;
	publicId: string;
}
