import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import budgetService from '../services/budgetService';
import expenseService from '../services/expenseService';
import type { Budget } from '../types/budget';
import type { Expense, TotalExpensesResponse } from '../types/expense';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../components/ui/card';

const DashboardPage: React.FC = () => {
	const [budget, setBudget] = useState<Budget | null>(null);
	const [expensesData, setExpensesData] =
		useState<TotalExpensesResponse | null>(null);
	const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;

	const fetchDashboardData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [budgetData, expensesResponse, allExpenses] = await Promise.all([
				budgetService.getBudgetByMonthYear(currentYear, currentMonth),
				expenseService.getTotalExpensesByMonthYear(currentYear, currentMonth),
				expenseService.getAllExpenses(),
			]);

			setBudget(budgetData);
			setExpensesData(expensesResponse); // Now properly using TotalExpensesResponse

			const sortedRecentExpenses = allExpenses
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
				.slice(0, 5);
			setRecentExpenses(sortedRecentExpenses);
		} catch (err: any) {
			console.error('Failed to fetch dashboard data:', err);

			if (
				err.response?.status === 404 &&
				err.response.data?.message?.includes('Budget not found')
			) {
				setBudget(null);
				try {
					const expensesResponse =
						await expenseService.getTotalExpensesByMonthYear(
							currentYear,
							currentMonth
						);
					setExpensesData(expensesResponse); // Properly set the response object

					const allExpenses = await expenseService.getAllExpenses();
					const sortedRecentExpenses = allExpenses
						.sort(
							(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
						)
						.slice(0, 5);
					setRecentExpenses(sortedRecentExpenses);
				} catch (expenseErr) {
					setExpensesData({ total: 0 }); // Default response when no expenses
					setRecentExpenses([]);
				}
			} else {
				const errorMessage =
					err.response?.data?.message ||
					'Failed to load dashboard data. Please try again.';
				setError(errorMessage);
				toast.error('Error Loading Dashboard', {
					description: errorMessage,
				});
				setExpensesData(null);
			}
		} finally {
			setLoading(false);
		}
	}, [currentYear, currentMonth]);

	useEffect(() => {
		fetchDashboardData();
	}, [fetchDashboardData]);

	const totalExpenses = expensesData?.total ?? 0;
	const remainingAmount = budget ? budget.amount - totalExpenses : null;
	const isOverBudget = remainingAmount !== null && remainingAmount < 0;
	const hasBudget = budget !== null;

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
				<p className='mt-4'>Loading dashboard data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container mx-auto p-4'>
				<div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded'>
					<h1 className='text-2xl font-bold mb-2'>Error</h1>
					<p>{error}</p>
					<button
						onClick={fetchDashboardData}
						className='mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
			<p className='mb-6 text-gray-600'>
				Welcome to your Budget App Dashboard!
			</p>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{/* Budget Card */}
				<Card>
					<CardHeader>
						<CardTitle>
							Current Month's Budget ({currentMonth}/{currentYear})
						</CardTitle>
					</CardHeader>
					<CardContent>
						{hasBudget ? (
							<div className='space-y-3'>
								<p>Budgeted Amount: {formatCurrency(budget.amount)}</p>
								<p>Total Expenses: {formatCurrency(totalExpenses)}</p>
								<p>
									Remaining:{' '}
									<span
										className={
											isOverBudget
												? 'text-red-600 font-medium'
												: 'text-green-600 font-medium'
										}>
										{formatCurrency(Math.abs(remainingAmount!))}{' '}
										{isOverBudget ? 'Over Budget' : 'Remaining'}
									</span>
								</p>
								<Link
									to={`/budget/details/${currentYear}/${currentMonth}`}
									className='text-blue-600 hover:underline inline-block mt-2'>
									View Budget Details
								</Link>
							</div>
						) : (
							<div className='space-y-3'>
								<p className='text-gray-600'>
									No budget set for {currentMonth}/{currentYear}.
								</p>
								<Link
									to='/budget/setup'
									className='text-blue-600 hover:underline inline-block mt-2'>
									Set Up Budget
								</Link>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Recent Expenses Card */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Expenses</CardTitle>
					</CardHeader>
					<CardContent>
						{recentExpenses.length === 0 ? (
							<p className='text-gray-600'>No recent expenses recorded.</p>
						) : (
							<ul className='space-y-2'>
								{recentExpenses.map((expense) => (
									<li key={expense.id} className='flex justify-between'>
										<div>
											<span className='font-medium'>
												{expense.category || 'Uncategorized'}
											</span>
											<span className='text-gray-500 text-sm block'>
												{new Date(expense.date).toLocaleDateString()}
											</span>
										</div>
										<span className='font-medium'>
											{formatCurrency(expense.amount)}
										</span>
									</li>
								))}
							</ul>
						)}
						<Link
							to='/expenses'
							className='text-blue-600 hover:underline inline-block mt-4'>
							View All Expenses
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DashboardPage;
