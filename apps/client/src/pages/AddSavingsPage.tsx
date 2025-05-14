import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import savingsService from '../services/savingsService';
import type { CreateSavingsDto } from '../types/saving';
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

// Zod schema for form validation
const savingsFormSchema = z.object({
	amount: z.coerce
		.number({ required_error: 'Amount is required' })
		.positive('Amount must be greater than zero')
		.max(1000000, 'Amount must be less than $1,000,000'),
	date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: 'Date must be a valid date',
	}),
	description: z.string().optional(),
});

type SavingsFormValues = z.infer<typeof savingsFormSchema>;

const AddSavingsPage: React.FC = () => {
	const navigate = useNavigate();

	const form = useForm<SavingsFormValues>({
		resolver: zodResolver(savingsFormSchema),
		defaultValues: {
			amount: 0,
			date: new Date().toISOString().split('T')[0], // Default to today's date
			description: '',
		},
	});

	const onSubmit = async (values: SavingsFormValues) => {
		try {
			const result = await savingsService.createSavings(
				values as CreateSavingsDto
			);

			toast.success('Savings Contribution Added', {
				description: `Added ${new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(
					result.amount
				)} on ${new Date(result.date).toLocaleDateString()}`,
				action: {
					label: 'View Summary',
					onClick: () =>
						navigate(
							`/summary/${new Date(result.date).getFullYear()}/${new Date(result.date).getMonth() + 1}`
						),
				},
			});

			form.reset();
			navigate('/dashboard');
		} catch (err) {
			console.error('Failed to add savings:', err);
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Failed to add savings. Please try again.';

			toast.error('Error Adding Savings', {
				description: errorMessage,
			});
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<div className='w-full max-w-md mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md'>
				<h2 className='text-2xl font-bold text-center'>
					Add Savings Contribution
				</h2>

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
												placeholder='500.00'
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
										<Input placeholder='e.g., Emergency fund' {...field} />
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
										Saving...
									</>
								) : (
									'Save Contribution'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default AddSavingsPage;
