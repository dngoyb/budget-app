import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import incomeService from '../services/incomeService';
import expenseService from '../services/expenseService';
import savingsService from '../services/savingsService';
import type { Income } from '../types/income';
import type { TotalExpensesResponse, Expense } from '../types/expense';
import type { Savings } from '../types/saving';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../components/ui/alert-dialog';

const MonthlySummaryPage: React.FC = () => {
	const navigate = useNavigate();
	const { year: yearParam, month: monthParam } = useParams<{
		year: string;
		month: string;
	}>();

	const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
	const month = monthParam
		? parseInt(monthParam, 10)
		: new Date().getMonth() + 1;

	// State
	const [incomeEntries, setIncomeEntries] = useState<Income[]>([]);
	const [totalIncome, setTotalIncome] = useState<number | null>(null);
	const [expensesList, setExpensesList] = useState<Expense[]>([]);
	const [expensesData, setExpensesData] =
		useState<TotalExpensesResponse | null>(null);
	const [savingsList, setSavingsList] = useState<Savings[]>([]);
	const [totalSavings, setTotalSavings] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<{
		type: 'income' | 'savings';
		id: string;
		amount: number;
		description: string;
	} | null>(null);

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
					description: 'Please provide a valid month (1-12) and year.',
				});
				return;
			}

			try {
				const [
					incomeList,
					incomeTotal,
					expenseTotal,
					expenseList,
					savingsTotal,
					savingsList,
				] = await Promise.all([
					incomeService.getIncomeByMonthYear(year, month),
					incomeService.getTotalIncomeByMonthYear(year, month),
					expenseService.getTotalExpensesByMonthYear(year, month),
					expenseService.getExpensesByMonthYear(year, month),
					savingsService.getTotalSavingsByMonthYear(year, month),
					savingsService.getSavingsByMonthYear(year, month),
				]);

				setIncomeEntries(Array.isArray(incomeList) ? incomeList : []);
				setTotalIncome(incomeTotal);
				setExpensesData(expenseTotal);
				setExpensesList(expenseList || []);
				setTotalSavings(savingsTotal);
				setSavingsList(savingsList || []);
			} catch (err) {
				console.error('Failed to fetch monthly summary:', err);
				const errorMessage =
					(err as AxiosError<{ message: string }>)?.response?.data?.message ||
					(err instanceof Error
						? err.message
						: 'Failed to load monthly summary. Please try again.');

				setError(errorMessage);
				toast.error('Error Loading Summary', {
					description: errorMessage,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [year, month]);

	const remainingAmount =
		totalIncome !== null && expensesData && totalSavings !== null
			? totalIncome - expensesData.total - totalSavings
			: null;

	const isNegative = remainingAmount !== null && remainingAmount < 0;
	const monthName = format(new Date(year, month - 1), 'MMMM yyyy');

	const handleDeleteClick = (
		type: 'income' | 'savings',
		id: string,
		amount: number,
		description: string
	) => {
		setItemToDelete({ type, id, amount, description });
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!itemToDelete) return;

		try {
			if (itemToDelete.type === 'income') {
				await incomeService.deleteIncomeById(itemToDelete.id);
				toast.success('Income Deleted', {
					description: `Deleted income of $${itemToDelete.amount.toFixed(2)} from "${itemToDelete.description}"`,
				});
			} else {
				await savingsService.deleteSavingsById(itemToDelete.id);
				toast.success('Savings Deleted', {
					description: `Deleted savings contribution of $${itemToDelete.amount.toFixed(2)}`,
				});
			}

			// Refresh the data
			const [
				incomeList,
				incomeTotal,
				expenseTotal,
				expenseList,
				savingsTotal,
				savingsList,
			] = await Promise.all([
				incomeService.getIncomeByMonthYear(year, month),
				incomeService.getTotalIncomeByMonthYear(year, month),
				expenseService.getTotalExpensesByMonthYear(year, month),
				expenseService.getExpensesByMonthYear(year, month),
				savingsService.getTotalSavingsByMonthYear(year, month),
				savingsService.getSavingsByMonthYear(year, month),
			]);

			setIncomeEntries(Array.isArray(incomeList) ? incomeList : []);
			setTotalIncome(incomeTotal);
			setExpensesData(expenseTotal);
			setExpensesList(expenseList || []);
			setTotalSavings(savingsTotal);
			setSavingsList(savingsList || []);
		} catch (err) {
			console.error('Delete error:', err);
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Failed to delete entry. Please try again.';

			toast.error('Delete Failed', {
				description: errorMessage,
			});
		} finally {
			setDeleteDialogOpen(false);
			setItemToDelete(null);
		}
	};

	if (loading) {
		return (
			<div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[300px]'>
				<Loader2 className='h-8 w-8 animate-spin' />
				<p className='mt-4'>Loading monthly summary...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container mx-auto p-4'>
				<div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded text-center'>
					<h2 className='text-xl font-bold mb-2'>Error Loading Summary</h2>
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
				<h1 className='text-2xl font-bold'>Monthly Summary for {monthName}</h1>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
				{/* Total Income */}
				<Card>
					<CardHeader>
						<CardTitle className='text-lg'>Total Income</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold'>
							{totalIncome !== null ? formatCurrency(totalIncome) : '--'}
						</p>
					</CardContent>
				</Card>

				{/* Total Expenses */}
				<Card>
					<CardHeader>
						<CardTitle className='text-lg'>Total Expenses</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold'>
							{expensesData ? formatCurrency(expensesData.total) : '--'}
						</p>
					</CardContent>
				</Card>

				{/* Total Savings */}
				<Card>
					<CardHeader>
						<CardTitle className='text-lg'>Total Saved</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold'>
							{totalSavings !== null ? formatCurrency(totalSavings) : '--'}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className='mb-8'>
				<h2 className='text-xl font-bold mb-4'>Remaining Amount</h2>
				<Card
					className={isNegative ? 'border-red-200 bg-red-50' : 'bg-green-50'}>
					<CardContent className='p-6'>
						<p
							className={`text-3xl font-bold ${
								isNegative ? 'text-red-600' : 'text-green-600'
							}`}>
							{remainingAmount !== null ? (
								<>
									{formatCurrency(Math.abs(remainingAmount))}
									<span className='text-sm font-normal ml-2'>
										{isNegative ? 'Over Budget' : 'Remaining'}
									</span>
								</>
							) : (
								'--'
							)}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Income Sources */}
				<div>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-xl font-bold'>Income Sources</h2>
						<Button variant='outline' onClick={() => navigate('/income/add')}>
							<PlusCircle className='mr-2 h-4 w-4' />
							Add Income
						</Button>
					</div>

					{incomeEntries.length === 0 ? (
						<div className='text-center py-8 border rounded-lg'>
							<p className='text-gray-600'>No income sources added yet.</p>
						</div>
					) : (
						<div className='space-y-4'>
							{incomeEntries.map((income) => (
								<Card key={income.id}>
									<CardContent className='p-4'>
										<div className='flex justify-between items-start'>
											<div>
												<h3 className='font-medium'>{income.source}</h3>
												<p className='text-sm text-gray-600'>
													{format(new Date(income.createdAt), 'MMM d, yyyy')}
												</p>
											</div>
											<div className='flex items-center gap-2'>
												<p className='font-bold'>
													{formatCurrency(income.amount)}
												</p>
												<Button
													variant='ghost'
													size='icon'
													onClick={() => navigate(`/income/edit/${income.id}`)}
													className='h-8 w-8'>
													<Pencil className='h-4 w-4' />
												</Button>
												<Button
													variant='ghost'
													size='icon'
													onClick={() =>
														handleDeleteClick(
															'income',
															income.id,
															income.amount,
															income.source
														)
													}
													className='h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50'>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>

				{/* Expenses */}
				<div>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-xl font-bold'>Expenses</h2>
						<Button onClick={() => navigate('/expenses/add')}>
							<PlusCircle className='mr-2 h-4 w-4' />
							Add Expense
						</Button>
					</div>

					{expensesList.length === 0 ? (
						<div className='text-center py-8 border rounded-lg'>
							<p className='text-gray-600'>No expenses recorded yet.</p>
						</div>
					) : (
						<div className='space-y-4'>
							{expensesList.map((expense) => (
								<Card key={expense.id}>
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
				</div>

				{/* Savings Contributions */}
				<div>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-xl font-bold'>Savings</h2>
						<Button onClick={() => navigate('/savings/add')}>
							<PlusCircle className='mr-2 h-4 w-4' />
							Add Savings
						</Button>
					</div>

					{savingsList.length === 0 ? (
						<div className='text-center py-8 border rounded-lg'>
							<p className='text-gray-600'>No savings contributions yet.</p>
						</div>
					) : (
						<div className='space-y-4'>
							{savingsList.map((savings) => (
								<Card key={savings.id}>
									<CardContent className='p-4'>
										<div className='flex justify-between items-start'>
											<div>
												<h3 className='font-medium'>Savings</h3>
												<p className='text-sm text-gray-600'>
													{format(new Date(savings.date), 'MMM d, yyyy')}
												</p>
												{savings.description && (
													<p className='text-sm text-gray-500 mt-1 line-clamp-1'>
														{savings.description}
													</p>
												)}
											</div>
											<div className='flex items-center gap-2'>
												<p className='font-bold'>
													{formatCurrency(savings.amount)}
												</p>
												<Button
													variant='ghost'
													size='icon'
													onClick={() =>
														navigate(`/savings/edit/${savings.id}`)
													}
													className='h-8 w-8'>
													<Pencil className='h-4 w-4' />
												</Button>
												<Button
													variant='ghost'
													size='icon'
													onClick={() =>
														handleDeleteClick(
															'savings',
															savings.id,
															savings.amount,
															savings.description || 'Savings'
														)
													}
													className='h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50'>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the{' '}
							{itemToDelete?.type === 'income' ? 'income' : 'savings'} entry of{' '}
							{formatCurrency(itemToDelete?.amount || 0)}.
							{itemToDelete?.type === 'income'
								? ` from "${itemToDelete?.description}"`
								: itemToDelete?.description !== 'Savings'
									? ` (${itemToDelete?.description})`
									: ''}
							. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							className='bg-red-600 hover:bg-red-700'>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default MonthlySummaryPage;
