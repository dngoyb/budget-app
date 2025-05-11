import React, { useEffect, useState } from 'react';
import expenseService from '../services/expenseService';
import { useNavigate } from 'react-router-dom';
import type { Expense } from '../types/expense';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

type ApiError = {
	response?: {
		data?: {
			message?: string;
		};
	};
};

const ExpenseListPage: React.FC = () => {
	const navigate = useNavigate();

	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchExpenses = async () => {
			setLoading(true);
			setError(null);
			try {
				const fetchedExpenses = await expenseService.getAllExpenses();
				setExpenses(fetchedExpenses);
			} catch (err) {
				console.error('Failed to fetch expenses:', err);
				let errorMessage = 'Failed to load expenses. Please try again.';

				if (typeof err === 'object' && err !== null) {
					const apiError = err as ApiError;
					errorMessage = apiError.response?.data?.message || errorMessage;
				} else if (err instanceof Error) {
					errorMessage = err.message;
				}

				setError(errorMessage);
				toast.error('Error Loading Expenses', {
					description: errorMessage,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchExpenses();
	}, []);

	const handleGoToAddExpense = () => {
		navigate('/expenses/add'); // Navigate to the expense entry page
	};

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				{' '}
				{/* Flex container for title and button */}
				<h1 className='text-2xl font-bold'>Expense List</h1>
				<Button onClick={handleGoToAddExpense}>Add New Expense</Button>{' '}
				{/* Add button */}
			</div>

			{loading && <p className='text-center'>Loading expenses...</p>}
			{error && <p className='text-center text-red-500'>Error: {error}</p>}

			{!loading && !error && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{expenses.length === 0 ? (
						<p className='col-span-full text-center text-gray-600'>
							No expenses recorded yet.
						</p>
					) : (
						expenses.map((expense) => (
							<Card key={expense.id}>
								<CardHeader>
									<CardTitle className='text-lg'>
										{expense.category || 'Uncategorized'}
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-2'>
									<p>
										<strong>Amount:</strong> ${expense.amount.toFixed(2)}
									</p>
									<p>
										<strong>Date:</strong>{' '}
										{new Date(expense.date).toLocaleDateString()}
									</p>
									{expense.description && (
										<p>
											<strong>Description:</strong> {expense.description}
										</p>
									)}
								</CardContent>
							</Card>
						))
					)}
				</div>
			)}
		</div>
	);
	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				{' '}
				{/* Flex container for title and button */}
				<h1 className='text-2xl font-bold'>Expense List</h1>
				<Button onClick={handleGoToAddExpense}>Add New Expense</Button>{' '}
				{/* Add button */}
			</div>

			{loading && <p className='text-center'>Loading expenses...</p>}
			{error && <p className='text-center text-red-500'>Error: {error}</p>}

			{!loading && !error && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{expenses.length === 0 ? (
						<p className='col-span-full text-center text-gray-600'>
							No expenses recorded yet.
						</p>
					) : (
						expenses.map((expense) => (
							<Card key={expense.id}>
								<CardHeader>
									<CardTitle className='text-lg'>
										{expense.category || 'Uncategorized'}
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-2'>
									<p>
										<strong>Amount:</strong> ${expense.amount.toFixed(2)}
									</p>
									<p>
										<strong>Date:</strong>{' '}
										{new Date(expense.date).toLocaleDateString()}
									</p>
									{expense.description && (
										<p>
											<strong>Description:</strong> {expense.description}
										</p>
									)}
								</CardContent>
							</Card>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default ExpenseListPage;
