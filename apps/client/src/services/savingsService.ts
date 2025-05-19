import api from './api';
import type {
	CreateSavingsDto,
	UpdateSavingsDto,
	Savings,
} from '../types/saving';
import { isAxiosError } from 'axios';

const savingsService = {
	createSavings: async (savingsData: CreateSavingsDto): Promise<Savings> => {
		const response = await api.post('/savings', savingsData);
		return response.data;
	},

	getSavingsByMonthYear: async (
		year: number,
		month: number
	): Promise<Savings[]> => {
		try {
			const response = await api.get(`/savings/month/${year}/${month}`);
			return response.data;
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 404) {
				return [];
			}
			throw error;
		}
	},

	getTotalSavingsByMonthYear: async (
		year: number,
		month: number
	): Promise<number> => {
		try {
			const response = await api.get(`/savings/total/${year}/${month}`);
			return response.data.total || 0;
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 404) {
				return 0;
			}
			throw error;
		}
	},

	updateSavingsById: async (
		id: string,
		updateData: UpdateSavingsDto
	): Promise<Savings> => {
		const response = await api.put(`/savings/${id}`, updateData);
		return response.data;
	},

	deleteSavingsById: async (id: string): Promise<void> => {
		await api.delete(`/savings/${id}`);
	},

	getSavingsById: async (id: string): Promise<Savings> => {
		const response = await api.get(`/savings/id/${id}`);
		return response.data;
	},
};

export default savingsService;
