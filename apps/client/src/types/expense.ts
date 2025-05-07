// src/types/expense.ts

export interface CreateExpenseDto {
	amount: number;
	category?: string;
	description?: string;
	date: string;
}

export interface UpdateExpenseDto {
	amount?: number;
	category?: string;
	description?: string;
	date?: string;
}

export interface Expense {
	id: string;
	amount: number;
	category: string | null;
	description: string | null;
	date: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface TotalExpensesResponse {
	total: number;
}
