import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import budgetService from '../services/budgetService';
import expenseService from '../services/expenseService';
import type { Budget } from '../types/budget';
import type { TotalExpensesResponse, Expense } from '../types/expense';
import { toast } from 'sonner';

const DashboardPage: React.FC = () => {
	const [budget, setBudget] = useState<Budget | null>(null);
	const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
	const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const fetchedBudget = await budgetService.getBudgetByMonthYear(
					currentYear,
					currentMonth
				);
				setBudget(fetchedBudget);

				const fetchedTotalExpenses: TotalExpensesResponse =
					await expenseService.getTotalExpensesByMonthYear(
						currentYear,
						currentMonth
					);
				setTotalExpenses(fetchedTotalExpenses.total);

				const allExpenses = await expenseService.getAllExpenses();
				const sortedRecentExpenses = allExpenses
					.sort(
						(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
					)
					.slice(0, 5);
				setRecentExpenses(sortedRecentExpenses);
			} catch (err: any) {
				console.error('Failed to fetch dashboard data:', err);
				if (
					err.response &&
					err.response.status === 404 &&
					err.response.data?.message ===
						'Budget for this month and year not found for the authenticated user.'
				) {
					setBudget(null);
					setTotalExpenses(0);
					const allExpenses = await expenseService.getAllExpenses();
					const sortedRecentExpenses = allExpenses
						.sort(
							(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
						)
						.slice(0, 5);
					setRecentExpenses(sortedRecentExpenses);
				} else {
					const errorMessage =
						err.response?.data?.message ||
						'Failed to load dashboard data. Please try again.';
					setError(errorMessage);
					toast.error('Error Loading Dashboard', {
						description: errorMessage,
					});
					setBudget(null);
					setTotalExpenses(null);
					setRecentExpenses([]);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [currentYear, currentMonth]);

	const remainingAmount =
		budget !== null && totalExpenses !== null
			? budget.amount - totalExpenses
			: null;
	const isOverBudget = remainingAmount !== null && remainingAmount < 0;

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
			<p className='mb-4'>Welcome to your Budget App Dashboard!</p>

			{loading && <p className='text-center'>Loading dashboard data...</p>}
			{error && <p className='text-center text-red-500'>Error: {error}</p>}

			{!loading && !error && (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='p-4 border rounded shadow'>
						<h3 className='text-lg font-semibold mb-2'>
							Current Month's Budget ({currentMonth}/{currentYear})
						</h3>
						{budget ? (
							<>
								<p>Budgeted Amount: ${budget.amount.toFixed(2)}</p>
								<p>
									Total Expenses: $
									{totalExpenses !== null ? totalExpenses.toFixed(2) : '0.00'}
								</p>
								{remainingAmount !== null && (
									<p>
										Remaining:{' '}
										<span
											className={
												isOverBudget ? 'text-red-600' : 'text-green-600'
											}>
											${Math.abs(remainingAmount).toFixed(2)}{' '}
											{isOverBudget ? 'Over Budget' : 'Remaining'}
										</span>
									</p>
								)}
								<Link
									to={`/budget/details/${currentYear}/${currentMonth}`}
									className='text-blue-600 hover:underline mt-2 inline-block'>
									View Budget Details
								</Link>
							</>
						) : (
							<>
								<p className='text-gray-600'>
									No budget set for {currentMonth}/{currentYear}.
								</p>
								<Link
									to='/budget/setup'
									className='text-blue-600 hover:underline mt-2 inline-block'>
									Set Up Budget
								</Link>
							</>
						)}
					</div>

					<div className='p-4 border rounded shadow'>
						<h3 className='text-lg font-semibold mb-2'>Recent Expenses</h3>
						{recentExpenses.length === 0 ? (
							<p className='text-gray-600'>No recent expenses recorded.</p>
						) : (
							<ul>
								{recentExpenses.map((expense) => (
									<li key={expense.id} className='mb-1 text-sm'>
										<span className='font-semibold'>
											{expense.category || 'Uncategorized'}:
										</span>{' '}
										${expense.amount.toFixed(2)} on{' '}
										{new Date(expense.date).toLocaleDateString()}
									</li>
								))}
							</ul>
						)}
						<Link
							to='/expenses'
							className='text-blue-600 hover:underline mt-2 inline-block'>
							View All Expenses
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default DashboardPage;
