import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';
import UserInfoDisplay from '../components/UserInfoDisplay';
import { Button } from '../components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const expenseEntryFormSchema = z.object({
	amount: z
		.number({
			required_error: 'Amount is required',
			invalid_type_error: 'Amount must be a number',
		})
		.min(0.01, {
			message: 'Amount must be greater than 0',
		}),
	category: z.string().optional(),
	description: z.string().optional(),
	date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: 'Please enter a valid date',
	}),
});

type ExpenseEntryFormValues = {
	amount: number;
	date: string;
	category?: string;
	description?: string;
};

const ExpenseEntryPage: React.FC = () => {
	const navigate = useNavigate();

	const form = useForm<ExpenseEntryFormValues>({
		resolver: zodResolver(expenseEntryFormSchema),
		defaultValues: {
			amount: 0,
			category: '',
			description: '',
			date: new Date().toISOString().split('T')[0],
		},
	});

	const onSubmit: SubmitHandler<ExpenseEntryFormValues> = async (data) => {
		try {
			const result = await expenseService.createExpense({
				...data,
				category: data.category || '',
			});

			toast.success('Expense Added', {
				description: `Expense of ${result.amount} recorded.`,
			});

			form.reset();
			navigate('/expenses');
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Failed to add expense. Please try again.';

			toast.error('Expense Creation Failed', {
				description: errorMessage,
			});
		}
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			<div className='p-4 bg-white shadow-md'>
				<UserInfoDisplay />
			</div>

			<div className='container mx-auto p-4'>
				<div className='w-full max-w-md mx-auto p-8 space-y-6 bg-white rounded shadow-md'>
					<h2 className='text-2xl font-bold text-center'>Add New Expense</h2>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='amount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount</FormLabel>
										<FormControl>
											<Input
												type='number'
												step='0.01'
												placeholder='e.g., 50.75'
												{...field}
												onChange={(e) => field.onChange(Number(e.target.value))}
												value={field.value}
											/>
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
										<FormLabel>Categorys</FormLabel>
										<FormControl>
											<Input
												placeholder='e.g., Groceries'
												{...field}
												value={field.value || ''}
											/>
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
												placeholder='e.g., Weekly shopping'
												{...field}
												value={field.value || ''}
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
											<Input type='date' {...field} value={field.value} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type='submit'
								className='w-full'
								disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting
									? 'Adding Expense...'
									: 'Add Expense'}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ExpenseEntryPage;
