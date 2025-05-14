export interface CreateSavingsDto {
	amount: number;
	date: string; // ISO date string
	description?: string;
}

export interface UpdateSavingsDto {
	amount?: number;
	date?: string;
	description?: string;
}

export interface Savings {
	id: string;
	amount: number;
	date: string; // ISO date string
	description?: string | null;
	userId: string;
	createdAt: string;
	updatedAt: string;
}
