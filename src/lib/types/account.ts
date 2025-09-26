export interface User {
	user_id: number;
	username: string;
	user_type: string;
}

export interface Account {
	pinfo_id: number;
	email: string;
	first_name: string;
	last_name: string;
	dob: string | null;
	user: User | null;
}
