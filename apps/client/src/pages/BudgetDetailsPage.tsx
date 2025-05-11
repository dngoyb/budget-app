import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import budgetService from '../services/budgetService';
import expenseService from '../services/expenseService';
import type { Budget } from '../types/budget';
import type { TotalExpensesResponse } from '../types/expense';
import UserInfoDisplay from '../components/UserInfoDisplay';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../components/ui/card';
import { toast } from 'sonner';

const BudgetDetailsPage: React.FC = () => {
	const { year: yearParam, month: monthParam } = useParams<{
		year: string;
		month: string;
	}>();

	const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
	const month = monthParam
		? parseInt(monthParam, 10)
		: new Date().getMonth() + 1;

	const [budget, setBudget] = useState<Budget | null>(null);
	const [totalExpenses, setTotalExpenses] = useState<number | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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
				const fetchedBudget = await budgetService.getBudgetByMonthYear(
					year,
					month
				);
				setBudget(fetchedBudget);

				const fetchedTotalExpenses: TotalExpensesResponse =
					await expenseService.getTotalExpensesByMonthYear(year, month);
				setTotalExpenses(fetchedTotalExpenses.total);
			} catch (err) {
				console.error('Failed to fetch budget or expenses:', err);
				const errorMessage =
					err instanceof Error && err.message
						? err.message
						: 'Failed to load budget details. Please try again.';
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
		budget !== null && totalExpenses !== null
			? budget.amount - totalExpenses
			: null;
	const isOverBudget = remainingAmount !== null && remainingAmount < 0;

	return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			<div className='p-4 shadow-sm'>
				<UserInfoDisplay />
			</div>
			<div className='container mx-auto p-4'>
				<h1 className='text-2xl font-bold mb-6 text-center'>
					Budget Details for {month}/{year}
				</h1>

				{loading && <p className='text-center'>Loading budget details...</p>}
				{error && <p className='text-center text-red-500'>Error: {error}</p>}

				{!loading && !error && (
					<div>
						{!budget ? (
							<p className='text-center text-gray-600'>
								No budget set for {month}/{year}. Consider setting one up.
							</p>
						) : (
							<Card className='mb-6'>
								<CardHeader>
									<CardTitle className='text-xl'>Budget Summary</CardTitle>
								</CardHeader>
								<CardContent className='space-y-2'>
									<p>
										<strong>Budgeted Amount:</strong> $
										{budget.amount.toFixed(2)}
									</p>
									<p>
										<strong>Total Expenses:</strong> $
										{totalExpenses !== null
											? totalExpenses.toFixed(2)
											: 'Loading...'}
									</p>
									{remainingAmount !== null && (
										<p>
											<strong>Remaining:</strong>{' '}
											<span
												className={
													isOverBudget ? 'text-red-600' : 'text-green-600'
												}>
												${Math.abs(remainingAmount).toFixed(2)}{' '}
												{isOverBudget ? 'Over Budget' : 'Remaining'}
											</span>
										</p>
									)}
								</CardContent>
							</Card>
						)}

						<h2 className='text-xl font-bold mt-8 mb-4'>
							Expenses for {month}/{year}
						</h2>
						<p className='text-center text-gray-600'>
							Expense list for this period will go here.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default BudgetDetailsPage;
