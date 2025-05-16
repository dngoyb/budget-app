import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';
import incomeService from '../services/incomeService';
import savingsService from '../services/savingsService';
import type { CreateExpenseDto } from '../types/expense';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ExpenseEntryPage: React.FC = () => {
	const navigate = useNavigate();
	const [availableAmount, setAvailableAmount] = useState<number>(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAvailableAmount = async () => {
			const currentDate = new Date();
			const currentYear = currentDate.getFullYear();
			const currentMonth = currentDate.getMonth() + 1;

			try {
				const [incomeTotal, savingsTotal] = await Promise.all([
					incomeService.getTotalIncomeByMonthYear(currentYear, currentMonth),
					savingsService.getTotalSavingsByMonthYear(currentYear, currentMonth),
				]);

				setAvailableAmount(incomeTotal - savingsTotal);
			} catch (error) {
				console.error('Error fetching available amount:', error);
				toast.error('Error', {
					description: 'Could not fetch available amount for validation',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchAvailableAmount();
	}, []);

	const expenseFormSchema = z.object({
		amount: z.coerce
			.number({ required_error: 'Amount is required' })
			.positive('Amount must be greater than zero')
			.max(1000000, 'Amount must be less than $1,000,000')
			.refine((val) => val <= availableAmount, {
				message: `Amount cannot exceed available funds of $${availableAmount.toLocaleString()}`,
			}),
		category: z.string().min(1, 'Category is required'),
		date: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: 'Date must be a valid date',
		}),
		description: z.string().optional(),
	});

	const form = useForm<z.infer<typeof expenseFormSchema>>({
		resolver: zodResolver(expenseFormSchema),
		defaultValues: {
			amount: 0,
			category: '',
			date: new Date().toISOString().split('T')[0],
			description: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof expenseFormSchema>) => {
		try {
			const result = await expenseService.createExpense(
				values as CreateExpenseDto
			);

			toast.success('Expense Added', {
				description: `Added ${new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(result.amount)} for ${result.category}`,
				action: {
					label: 'View All',
					onClick: () => navigate('/expenses'),
				},
			});

			form.reset();
			navigate('/expenses');
		} catch (err) {
			console.error('Failed to add expense:', err);
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Failed to add expense. Please try again.';

			toast.error('Error Adding Expense', {
				description: errorMessage,
			});
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center p-8'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<div className='container mx-auto p-4'>
			<div className='w-full max-w-md mx-auto p-6 space-y-6 bg-card text-card-foreground rounded-lg shadow-md'>
				<h2 className='text-2xl font-bold text-center text-foreground'>
					Add New Expense
				</h2>

				{availableAmount <= 0 ? (
					<div className='text-destructive text-center p-4 bg-destructive/10 rounded-lg'>
						No funds available for expenses. Your savings have exceeded your
						income.
					</div>
				) : (
					<div className='text-green-600 text-center p-4 bg-green-50/50 dark:bg-green-950/50 rounded-lg'>
						Available amount for expenses:{' '}
						{new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(availableAmount)}
					</div>
				)}

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<div className='relative'>
											<span className='absolute left-3 top-1/2 -translate-y-1/2'>
												$
											</span>
											<Input
												type='number'
												step='0.01'
												min='0.01'
												placeholder='100.00'
												className='pl-8'
												{...field}
												onChange={(e) =>
													field.onChange(parseFloat(e.target.value))
												}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='category'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Input
											placeholder='e.g., Groceries, Utilities'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='date'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<Input type='date' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description (Optional)</FormLabel>
									<FormControl>
										<Input
											placeholder='Additional details about the expense'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='grid grid-cols-2 gap-4'>
							<Button
								type='button'
								variant='outline'
								className='w-full'
								onClick={() => navigate(-1)}>
								Cancel
							</Button>
							<Button type='submit' className='w-full'>
								{form.formState.isSubmitting ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Adding...
									</>
								) : (
									'Add Expense'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default ExpenseEntryPage;
