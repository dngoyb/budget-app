import api from './api';
import type { CreateBudgetDto, Budget } from '../types/budget';
import { isAxiosError } from 'axios';

const budgetService = {
	createBudget: async (budgetData: CreateBudgetDto): Promise<Budget> => {
		const response = await api.post('/budget', budgetData);
		return response.data;
	},

	getAllBudgets: async (): Promise<Budget[]> => {
		const response = await api.get('/budget');
		return response.data;
	},

	getBudgetByMonthYear: async (
		year: number,
		month: number
	): Promise<Budget | null> => {
		try {
			const response = await api.get(`/budget/${year}/${month}`);
			return response.data;
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 404) {
				return null;
			}
			throw error;
		}
	},
};

export default budgetService;
