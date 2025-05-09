import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import type { CreateUserDto } from '../types/auth';
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

const registrationFormSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters.',
	}),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const RegistrationPage: React.FC = () => {
	const navigate = useNavigate();

	const form = useForm<RegistrationFormValues>({
		resolver: zodResolver(registrationFormSchema),
		defaultValues: {
			email: '',
			name: '',
			password: '',
		},
	});

	const onSubmit = async (values: RegistrationFormValues) => {
		const userData: CreateUserDto = values;

		try {
			const result = await authService.register(userData);
			console.log('Registration successful:', result);
			toast.success('Registration Successful', {
				description: 'You can now log in with your new account.',
			});
			navigate('/login');
		} catch (err: any) {
			console.error('Registration error:', err);
			const errorMessage =
				err.response?.data?.message || 'Registration failed. Please try again.';
			toast.error('Registration Failed', {
				description: errorMessage,
			});
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md'>
				<h2 className='text-2xl font-bold text-center'>
					Register for a New Account
				</h2>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Enter your email' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='Enter your name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='Enter your password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							className='w-full'
							disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? 'Registering...' : 'Register'}
						</Button>
					</form>
				</Form>

				<p className='text-center text-sm text-gray-600'>
					Already have an account?{' '}
					<a
						href='/login'
						className='font-medium text-blue-600 hover:underline'>
						Login here
					</a>
				</p>
			</div>
		</div>
	);
};

export default RegistrationPage;
