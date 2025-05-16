import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import incomeService from '../services/incomeService';
import type { CreateIncomeDto } from '../types/income';
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

const incomeFormSchema = z.object({
	amount: z.coerce
		.number({
			required_error: 'Amount is required',
			invalid_type_error: 'Amount must be a number',
		})
		.positive({ message: 'Amount must be greater than 0' })
		.max(1000000, { message: 'Amount must be less than 1,000,000' }),
	month: z.coerce
		.number({
			required_error: 'Month is required',
			invalid_type_error: 'Month must be a number',
		})
		.int({ message: 'Month must be an integer' })
		.min(1, { message: 'Month must be between 1 and 12' })
		.max(12, { message: 'Month must be between 1 and 12' }),
	year: z.coerce
		.number({
			required_error: 'Year is required',
			invalid_type_error: 'Year must be a number',
		})
		.int({ message: 'Year must be an integer' })
		.min(2000, { message: 'Year must be 2000 or later' })
		.max(2100, { message: 'Year must be 2100 or earlier' }),
	source: z.string().min(1, { message: 'Source is required' }),
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

const AddIncomePage: React.FC = () => {
	const navigate = useNavigate();
	const currentDate = new Date();

	const form = useForm<IncomeFormValues>({
		resolver: zodResolver(incomeFormSchema),
		defaultValues: {
			amount: 0,
			month: currentDate.getMonth() + 1,
			year: currentDate.getFullYear(),
			source: '',
		},
	});

	const onSubmit = async (values: IncomeFormValues) => {
		try {
			const result = await incomeService.createIncome(
				values as CreateIncomeDto
			);

			toast.success('Income Added', {
				description: `Added $${result.amount.toFixed(2)} from "${result.source}" for ${result.month}/${result.year}`,
				action: {
					label: 'View Dashboard',
					onClick: () => navigate('/dashboard'),
				},
			});

			form.reset();
			navigate('/dashboard');
		} catch (err) {
			console.error('Income creation error:', err);
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Failed to create income. Please try again.';

			toast.error('Income Creation Failed', {
				description: errorMessage,
			});
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<div className='w-full max-w-md mx-auto p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md'>
				<h2 className='text-2xl font-bold text-center text-foreground'>
					Add Income Source
				</h2>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Income Amount</FormLabel>
									<FormControl>
										<div className='relative'>
											<span className='absolute left-3 top-1/2 -translate-y-1/2'>
												$
											</span>
											<Input
												type='number'
												step='0.01'
												min='0.01'
												placeholder='5000.00'
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
							name='source'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Source</FormLabel>
									<FormControl>
										<Input placeholder='e.g. Salary, Freelance' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='month'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Month</FormLabel>
										<FormControl>
											<Input
												type='number'
												min='1'
												max='12'
												placeholder='1-12'
												{...field}
											/>
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
											<Input
												type='number'
												min='2000'
												max='2100'
												placeholder='YYYY'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<Button
								type='button'
								variant='outline'
								className='w-full'
								onClick={() => navigate('/dashboard')}
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
									'Add Income'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default AddIncomePage;
