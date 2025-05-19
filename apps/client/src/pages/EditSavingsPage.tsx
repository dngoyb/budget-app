import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import savingsService from '../services/savingsService';
import type { CreateSavingsDto, Savings } from '../types/saving';
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

const savingsFormSchema = z.object({
	amount: z.coerce
		.number({
			required_error: 'Amount is required',
			invalid_type_error: 'Amount must be a number',
		})
		.positive({ message: 'Amount must be greater than 0' })
		.max(1000000, { message: 'Amount must be less than 1,000,000' }),
	date: z.string().min(1, { message: 'Date is required' }),
	description: z.string().optional(),
});

type SavingsFormValues = z.infer<typeof savingsFormSchema>;

const EditSavingsPage: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(true);
	const [savings, setSavings] = useState<Savings | null>(null);

	const form = useForm<SavingsFormValues>({
		resolver: zodResolver(savingsFormSchema),
		defaultValues: {
			amount: 0,
			date: new Date().toISOString().split('T')[0],
			description: '',
		},
	});

	useEffect(() => {
		const fetchSavings = async () => {
			if (!id) {
				toast.error('Error', {
					description: 'No savings ID provided',
				});
				navigate('/dashboard');
				return;
			}

			try {
				const savingsData = await savingsService.getSavingsById(id);
				setSavings(savingsData);
				form.reset({
					amount: savingsData.amount,
					date: new Date(savingsData.date).toISOString().split('T')[0],
					description: savingsData.description || '',
				});
			} catch (error) {
				console.error('Error fetching savings:', error);
				toast.error('Error', {
					description: 'Failed to fetch savings details',
				});
				navigate('/dashboard');
			} finally {
				setLoading(false);
			}
		};

		fetchSavings();
	}, [id, form, navigate]);

	const onSubmit = async (values: SavingsFormValues) => {
		if (!id || !savings) return;

		try {
			const result = await savingsService.updateSavingsById(
				id,
				values as CreateSavingsDto
			);

			toast.success('Savings Updated', {
				description: `Updated savings contribution of $${result.amount.toFixed(2)}`,
				action: {
					label: 'View Dashboard',
					onClick: () => navigate('/dashboard'),
				},
			});

			const date = new Date(result.date);
			navigate(`/savings/${date.getFullYear()}/${date.getMonth() + 1}`);
		} catch (err) {
			console.error('Savings update error:', err);
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Failed to update savings. Please try again.';

			toast.error('Savings Update Failed', {
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
			<div className='w-full max-w-md mx-auto p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md'>
				<h2 className='text-2xl font-bold text-center text-foreground'>
					Edit Savings Contribution
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
								onClick={() => navigate(-1)}
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
										Updating...
									</>
								) : (
									'Update Savings'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default EditSavingsPage;
