export interface CreateIncomeDto {
	amount: number;
	source: string;
	month: number;
	year: number;
}

export interface Income {
	id: string;
	amount: number;
	source: string;
	month: number;
	year: number;
	userId: string;
	createdAt: string;
	updatedAt: string;
}
