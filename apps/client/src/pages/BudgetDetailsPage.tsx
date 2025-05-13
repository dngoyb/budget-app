import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import budgetService from '../services/budgetService';
import expenseService from '../services/expenseService';
import type { Budget } from '../types/budget';
import type { TotalExpensesResponse, Expense } from '../types/expense';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { AxiosError } from 'axios';

const BudgetDetailsPage: React.FC = () => {
	const navigate = useNavigate();
	const { year: yearParam, month: monthParam } = useParams<{
		year: string;
		month: string;
	}>();

	const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
	const month = monthParam
		? parseInt(monthParam, 10)
		: new Date().getMonth() + 1;

	const [budget, setBudget] = useState<Budget | null>(null);
	const [expensesData, setExpensesData] =
		useState<TotalExpensesResponse | null>(null);
	const [expensesList, setExpensesList] = useState<Expense[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			if (
				isNaN(month) ||
				month < 1 ||
				month > 12 ||
				isNaN(year) ||
				year < 1900
			) {
				setError('Invalid month or year provided in the URL.');
				setLoading(false);
				toast.error('Invalid Date', {
					description:
						'Please provide a valid month (1-12) and year in the URL.',
				});
				return;
			}

			try {
				const [budgetData, expensesResponse, expenses] = await Promise.all([
					budgetService.getBudgetByMonthYear(year, month),
					expenseService.getTotalExpensesByMonthYear(year, month),
					expenseService.getExpensesByMonthYear(year, month),
				]);

				setBudget(budgetData);
				setExpensesData(expensesResponse);
				setExpensesList(expenses);
			} catch (err) {
				console.error('Failed to fetch budget details:', err);
				const errorMessage =
					(err as AxiosError<{ message: string }>)?.response?.data?.message ||
					(err instanceof Error
						? err.message
						: 'Failed to load budget details. Please try again.');

				setError(errorMessage);
				toast.error('Error Loading Details', {
					description: errorMessage,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [year, month]);

	const remainingAmount =
		budget && expensesData ? budget.amount - expensesData.total : null;
	const isOverBudget = remainingAmount !== null && remainingAmount < 0;
	const monthName = format(new Date(year, month - 1), 'MMMM yyyy');

	if (loading) {
		return (
			<div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[300px]'>
				<Loader2 className='h-8 w-8 animate-spin' />
				<p className='mt-4'>Loading budget details...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container mx-auto p-4'>
				<div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded text-center'>
					<h2 className='text-xl font-bold mb-2'>Error Loading Budget</h2>
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
			<div className='flex items-center mb-6'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => navigate(-1)}
					className='mr-4'>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<h1 className='text-2xl font-bold'>Budget Details for {monthName}</h1>
			</div>

			{!budget ? (
				<div className='text-center py-8'>
					<p className='text-gray-600 mb-4'>No budget set for {monthName}.</p>
					<Button onClick={() => navigate('/budget/setup')}>
						<PlusCircle className='mr-2 h-4 w-4' />
						Set Up Budget
					</Button>
				</div>
			) : (
				<>
					<Card className='mb-8'>
						<CardHeader>
							<CardTitle className='text-xl'>Budget Summary</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div className='border rounded-lg p-4'>
									<h3 className='text-sm font-medium text-gray-500'>
										Budgeted
									</h3>
									<p className='text-2xl font-bold'>
										{formatCurrency(budget.amount)}
									</p>
								</div>
								<div className='border rounded-lg p-4'>
									<h3 className='text-sm font-medium text-gray-500'>Spent</h3>
									<p className='text-2xl font-bold'>
										{expensesData ? formatCurrency(expensesData.total) : '--'}
									</p>
								</div>
								<div
									className={`border rounded-lg p-4 ${
										isOverBudget
											? 'bg-red-50 border-red-200'
											: 'bg-green-50 border-green-200'
									}`}>
									<h3 className='text-sm font-medium text-gray-500'>
										Remaining
									</h3>
									<p
										className={`text-2xl font-bold ${
											isOverBudget ? 'text-red-600' : 'text-green-600'
										}`}>
										{remainingAmount !== null ? (
											<>
												{formatCurrency(Math.abs(remainingAmount))}
												<span className='text-sm font-normal ml-2'>
													{isOverBudget ? 'Over Budget' : 'Remaining'}
												</span>
											</>
										) : (
											'--'
										)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className='mb-4 flex justify-between items-center'>
						<h2 className='text-xl font-bold'>Expenses</h2>
						<Button onClick={() => navigate('/expenses/add')}>
							<PlusCircle className='mr-2 h-4 w-4' />
							Add Expense
						</Button>
					</div>

					{expensesList.length === 0 ? (
						<div className='text-center py-8 border rounded-lg'>
							<p className='text-gray-600'>
								No expenses recorded for {monthName}.
							</p>
						</div>
					) : (
						<div className='space-y-4'>
							{expensesList.map((expense) => (
								<Card
									key={expense.id}
									className='hover:shadow-md transition-shadow'>
									<CardContent className='p-4 flex justify-between items-center'>
										<div>
											<h3 className='font-medium'>
												{expense.category || 'Uncategorized'}
											</h3>
											<p className='text-sm text-gray-600'>
												{format(new Date(expense.date), 'MMM d, yyyy')}
											</p>
											{expense.description && (
												<p className='text-sm text-gray-500 mt-1 line-clamp-1'>
													{expense.description}
												</p>
											)}
										</div>
										<p className='font-bold'>
											{formatCurrency(expense.amount)}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default BudgetDetailsPage;
