import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';
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
import { Loader2 } from 'lucide-react';

// Enhanced validation schema
const expenseEntryFormSchema = z.object({
	amount: z
		.number({
			required_error: 'Amount is required',
			invalid_type_error: 'Amount must be a number',
		})
		.positive({ message: 'Amount must be greater than 0' })
		.max(1000000, { message: 'Amount must be less than 1,000,000' }),
	category: z.string().min(1, 'Category is required').max(50),
	description: z.string().max(200).optional(),
	date: z.date({
		required_error: 'Date is required',
		invalid_type_error: 'Please enter a valid date',
	}),
});

type ExpenseEntryFormValues = z.infer<typeof expenseEntryFormSchema>;

const ExpenseEntryPage: React.FC = () => {
	const navigate = useNavigate();

	const form = useForm<ExpenseEntryFormValues>({
		resolver: zodResolver(expenseEntryFormSchema),
		defaultValues: {
			amount: 0,
			category: '',
			description: '',
			date: new Date(),
		},
	});

	const onSubmit: SubmitHandler<ExpenseEntryFormValues> = async (data) => {
		try {
			const result = await expenseService.createExpense({
				...data,
				date: data.date.toISOString(), // Convert Date object to ISO string
			});

			toast.success('Expense Added', {
				description: `Successfully recorded expense of $${result.amount.toFixed(2)}`,
				action: {
					label: 'View Expenses',
					onClick: () => navigate('/expenses'),
				},
			});

			form.reset();
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
		<div className='container mx-auto p-4'>
			<div className='w-full max-w-md mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md'>
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
										<div className='relative'>
											<span className='absolute left-3 top-1/2 -translate-y-1/2'>
												$
											</span>
											<Input
												type='number'
												step='0.01'
												min='0.01'
												placeholder='1500.00'
												className='pl-8'
												{...field}
												onFocus={(e) => {
													if (e.target.value === '0') {
														e.target.value = '';
													}
												}}
												onChange={(e) => {
													const value = parseFloat(e.target.value);
													field.onChange(isNaN(value) ? 0 : value);
												}}
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
										<Input placeholder='e.g., Groceries' {...field} />
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
											value={field.value ?? ''}
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
										<Input
											type='date'
											{...field}
											value={field.value?.toISOString().split('T')[0] ?? ''}
											onChange={(e) => field.onChange(new Date(e.target.value))}
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
								onClick={() => navigate('/expenses')}
								disabled={form.formState.isSubmitting}>
								Cancel
							</Button>
							<Button
								type='submit'
								className='w-full'
								disabled={form.formState.isSubmitting}>
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
