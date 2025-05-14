import api from './api';
import type { CreateIncomeDto, Income } from '../types/income';
import { isAxiosError } from 'axios';

const incomeService = {
	createIncome: async (incomeData: CreateIncomeDto): Promise<Income> => {
		const response = await api.post('/incomes', incomeData);
		return response.data;
	},

	getAllIncomes: async (): Promise<Income[]> => {
		const response = await api.get('/incomes');
		return response.data;
	},

	getIncomeByMonthYear: async (
		year: number,
		month: number
	): Promise<Income | null> => {
		try {
			const response = await api.get(`/incomes/${year}/${month}`);
			return response.data;
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 404) {
				return null;
			}
			throw error;
		}
	},

	getTotalIncomeByMonthYear: async (
		year: number,
		month: number
	): Promise<number> => {
		try {
			const response = await api.get(`/incomes/total/${year}/${month}`);
			return response.data.total || 0;
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 404) {
				return 0;
			}
			throw error;
		}
	},
};

export default incomeService;
