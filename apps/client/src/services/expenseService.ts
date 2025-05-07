import api from './api';
import type {
	CreateExpenseDto,
	UpdateExpenseDto,
	Expense,
	TotalExpensesResponse,
} from '../types/expense';
import { isAxiosError } from 'axios';

const expenseService = {
	createExpense: async (expenseData: CreateExpenseDto): Promise<Expense> => {
		const response = await api.post('/expenses', expenseData);
		return response.data;
	},

	getAllExpenses: async (): Promise<Expense[]> => {
		const response = await api.get('/expenses');
		return response.data;
	},

	getExpensesByCategory: async (categoryName: string): Promise<Expense[]> => {
		const response = await api.get(`/expenses/category/${categoryName}`);
		return response.data;
	},

	getExpensesByMonthYear: async (
		year: number,
		month: number
	): Promise<Expense[]> => {
		try {
			const response = await api.get(`/expenses/${year}/${month}`);
			return response.data;
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 404) {
				return [];
			}
			throw error;
		}
	},

	updateExpense: async (
		id: string,
		updateData: UpdateExpenseDto
	): Promise<Expense> => {
		const response = await api.patch(`/expenses/${id}`, updateData);
		return response.data;
	},

	deleteExpense: async (id: string): Promise<void> => {
		await api.delete(`/expenses/${id}`);
	},

	getTotalExpensesByMonthYear: async (
		year: number,
		month: number
	): Promise<TotalExpensesResponse> => {
		const response = await api.get(`/expenses/total/${year}/${month}`);
		return response.data;
	},
};

export default expenseService;
