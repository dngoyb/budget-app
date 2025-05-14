import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import incomeService from '../services/incomeService';
import expenseService from '../services/expenseService';
import savingsService from '../services/savingsService';
import type { Income } from '../types/income';
import type { Expense, TotalExpensesResponse } from '../types/expense';
import type { TotalSavingsResponse } from '../types/saving';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../components/ui/card';

const DashboardPage: React.FC = () => {
	const [income, setIncome] = useState<Income | null>(null);
	const [expensesData, setExpensesData] =
		useState<TotalExpensesResponse | null>(null);
	const [savingsData, setSavingsData] = useState<TotalSavingsResponse | null>(
		null
	);
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
			const [incomeList, , expensesTotal, allExpenses, savingsTotal] =
				await Promise.all([
					incomeService.getIncomeByMonthYear(currentYear, currentMonth),
					incomeService.getTotalIncomeByMonthYear(currentYear, currentMonth),
					expenseService.getTotalExpensesByMonthYear(currentYear, currentMonth),
					expenseService.getAllExpenses(),
					savingsService.getTotalSavingsByMonthYear(currentYear, currentMonth),
				]);

			setIncome(incomeList || null);
			setExpensesData(expensesTotal);
			setSavingsData({ total: savingsTotal });
			setRecentExpenses(
				allExpenses
					.sort(
						(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
					)
					.slice(0, 5)
			);
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			console.error('Failed to fetch dashboard data:', error);

			if (
				error.response?.status === 404 &&
				error.response.data?.message?.includes('Income not found')
			) {
				setIncome(null);
				try {
					const expensesTotal =
						await expenseService.getTotalExpensesByMonthYear(
							currentYear,
							currentMonth
						);
					const savingsTotal = await savingsService.getTotalSavingsByMonthYear(
						currentYear,
						currentMonth
					);

					setExpensesData(expensesTotal);
					setSavingsData({ total: savingsTotal });

					const allExpenses = await expenseService.getAllExpenses();
					setRecentExpenses(
						allExpenses
							.sort(
								(a, b) =>
									new Date(b.date).getTime() - new Date(a.date).getTime()
							)
							.slice(0, 5)
					);
				} catch {
					setExpensesData({ total: 0 });
					setRecentExpenses([]);
				}
			} else {
				const errorMessage =
					error.response?.data?.message ||
					'Failed to load dashboard data. Please try again.';
				setError(errorMessage);
				toast.error('Error Loading Dashboard', {
					description: errorMessage,
				});
				setExpensesData(null);
				setSavingsData(null);
			}
		} finally {
			setLoading(false);
		}
	}, [currentYear, currentMonth]);

	useEffect(() => {
		fetchDashboardData();
	}, [fetchDashboardData]);

	const totalIncome = income?.amount ?? 0;
	const totalExpenses = expensesData?.total ?? 0;
	const totalSavings = savingsData?.total ?? 0;

	const remainingAmount = totalIncome - totalExpenses - totalSavings;
	const isNegative = remainingAmount < 0;

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
				Welcome to your Personal Finance Dashboard!
			</p>

			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				{/* Total Income */}
				<Card>
					<CardHeader>
						<CardTitle>Total Income</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold'>{formatCurrency(totalIncome)}</p>
						<Link
							to={`/incomes/${currentYear}/${currentMonth}`}
							className='text-blue-600 hover:underline inline-block mt-2 text-sm'>
							View Income Summary
						</Link>
					</CardContent>
				</Card>

				{/* Total Expenses */}
				<Card>
					<CardHeader>
						<CardTitle>Total Expenses</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold'>
							{formatCurrency(totalExpenses)}
						</p>
						<Link
							to='/expenses'
							className='text-blue-600 hover:underline inline-block mt-2 text-sm'>
							View All Expenses
						</Link>
					</CardContent>
				</Card>

				{/* Total Saved */}
				<Card>
					<CardHeader>
						<CardTitle>Total Saved</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold'>{formatCurrency(totalSavings)}</p>
						<Link
							to={`/savings/${currentYear}/${currentMonth}`}
							className='text-blue-600 hover:underline inline-block mt-2 text-sm'>
							View Savings Summary
						</Link>
					</CardContent>
				</Card>

				{/* Remaining Amount */}
				<Card>
					<CardHeader>
						<CardTitle>Remaining</CardTitle>
					</CardHeader>
					<CardContent>
						<p
							className={`text-2xl font-bold ${
								isNegative ? 'text-red-600' : 'text-green-600'
							}`}>
							{formatCurrency(Math.abs(remainingAmount))}
							<span className='text-sm font-normal ml-2'>
								{isNegative ? 'Over Budget' : 'Remaining'}
							</span>
						</p>
						<Link
							to={`/dashboard/monthly-summary/${currentYear}/${currentMonth}`}
							className='text-blue-600 hover:underline inline-block mt-2 text-sm'>
							View Full Summary
						</Link>
					</CardContent>
				</Card>
			</div>

			<div className='mt-8'>
				<h2 className='text-xl font-semibold mb-4'>Recent Expenses</h2>
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
					className='text-blue-600 hover:underline mt-4 block'>
					View All Expenses
				</Link>
			</div>
		</div>
	);
};

export default DashboardPage;
