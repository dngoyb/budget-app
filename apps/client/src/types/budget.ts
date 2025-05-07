// src/types/budget.ts

/**
 * Represents the data structure for creating a new budget.
 * Matches the backend's CreateBudgetDto.
 */
export interface CreateBudgetDto {
	amount: number;
	month: number;
	year: number;
	// userId is handled by the backend based on the authenticated user
}

/**
 * Represents the structure of a budget object returned by the backend.
 * Matches the Prisma Budget model structure.
 */
export interface Budget {
	id: string;
	amount: number;
	month: number;
	year: number;
	userId: string; // The ID of the user this budget belongs to
	createdAt: string; // Dates are often returned as ISO strings from the backend
	updatedAt: string;
}
