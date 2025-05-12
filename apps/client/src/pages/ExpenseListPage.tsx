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
import { Loader2, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

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
				// Sort expenses by date (newest first)
				const sortedExpenses = fetchedExpenses.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
				);
				setExpenses(sortedExpenses);
			} catch (err) {
				console.error('Failed to fetch expenses:', err);
				const errorMessage =
					(err as any)?.response?.data?.message ||
					(err instanceof Error
						? err.message
						: 'Failed to load expenses. Please try again.');

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

	const handleGoToAddExpense = () => navigate('/expenses/add');
	const handleViewDetails = (id: string) => navigate(`/expenses/${id}`);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	if (loading) {
		return (
			<div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[300px]'>
				<Loader2 className='h-8 w-8 animate-spin' />
				<p className='mt-4'>Loading expenses...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container mx-auto p-4'>
				<div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded text-center'>
					<h2 className='text-xl font-bold mb-2'>Error Loading Expenses</h2>
					<p className='mb-4'>{error}</p>
					<Button variant='outline' onClick={() => window.location.reload()}>
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Expenses</h1>
				<Button onClick={handleGoToAddExpense}>
					<PlusCircle className='mr-2 h-4 w-4' />
					Add New Expense
				</Button>
			</div>

			{expenses.length === 0 ? (
				<div className='text-center py-12'>
					<p className='text-gray-600 mb-4'>No expenses recorded yet.</p>
					<Button onClick={handleGoToAddExpense}>
						<PlusCircle className='mr-2 h-4 w-4' />
						Add Your First Expense
					</Button>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{expenses.map((expense) => (
						<Card
							key={expense.id}
							className='hover:shadow-lg transition-shadow cursor-pointer'
							onClick={() => handleViewDetails(expense.id)}>
							<CardHeader>
								<CardTitle className='text-lg flex justify-between'>
									<span>{expense.category || 'Uncategorized'}</span>
									<span className='font-medium'>
										{formatCurrency(expense.amount)}
									</span>
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2'>
								<p className='text-sm text-gray-600'>
									{format(new Date(expense.date), 'MMM dd, yyyy')}
								</p>
								{expense.description && (
									<p className='text-sm line-clamp-2'>{expense.description}</p>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default ExpenseListPage;
