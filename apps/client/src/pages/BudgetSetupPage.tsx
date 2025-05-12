import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import budgetService from '../services/budgetService';
import type { CreateBudgetDto } from '../types/budget';
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

const budgetSetupFormSchema = z.object({
	amount: z.preprocess(
		(val) => Number(val),
		z
			.number({
				required_error: 'Amount is required.',
				invalid_type_error: 'Amount must be a number.',
			})
			.min(0.01, {
				message: 'Amount must be greater than 0.',
			})
	),
	month: z.preprocess(
		(val) => Number(val),
		z
			.number({
				required_error: 'Month is required.',
				invalid_type_error: 'Month must be a number.',
			})
			.int({
				message: 'Month must be an integer.',
			})
			.min(1, {
				message: 'Month must be between 1 and 12.',
			})
			.max(12, {
				message: 'Month must be between 1 and 12.',
			})
	),
	year: z.preprocess(
		(val) => Number(val),
		z
			.number({
				required_error: 'Year is required.',
				invalid_type_error: 'Year must be a number.',
			})
			.int({
				message: 'Year must be an integer.',
			})
			.min(1900, {
				message: 'Year must be a valid year.',
			})
	),
});

type BudgetSetupFormValues = z.infer<typeof budgetSetupFormSchema>;

const BudgetSetupPage: React.FC = () => {
	const navigate = useNavigate();

	const form = useForm<BudgetSetupFormValues>({
		resolver: zodResolver(
			budgetSetupFormSchema as z.ZodType<BudgetSetupFormValues>
		),
		defaultValues: {
			amount: 0,
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear(),
		},
	});

	const onSubmit = async (values: BudgetSetupFormValues) => {
		const budgetData: CreateBudgetDto = values;

		try {
			const result = await budgetService.createBudget(budgetData);
			console.log('Budget created successfully:', result);
			toast.success('Budget Created', {
				description: `Budget of ${result.amount} set for ${result.month}/${result.year}.`,
			});
			navigate('/dashboard'); // Using the navigate function
		} catch (err) {
			console.error('Budget creation error:', err);
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Failed to create budget. Please try again.';
			toast.error('Budget Creation Failed', {
				description: errorMessage,
			});
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<div className='w-full max-w-md mx-auto p-8 space-y-6 bg-white rounded shadow-md'>
				<h2 className='text-2xl font-bold text-center'>
					Set Your Monthly Budget
				</h2>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Monthly Budget Amount</FormLabel>
									<FormControl>
										<Input type='number' placeholder='e.g., 1500' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='month'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Month (1-12)</FormLabel>
									<FormControl>
										<Input type='number' placeholder='e.g., 5' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='year'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Year</FormLabel>
									<FormControl>
										<Input type='number' placeholder='e.g., 2025' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							className='w-full'
							disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? 'Setting Budget...' : 'Set Budget'}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default BudgetSetupPage;
