import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import authService from '../services/authService';
import type { LoginDto } from '../types/auth';
import type { AxiosError } from 'axios';

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

// Schema validation
const loginFormSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	password: z.string().min(1, {
		message: 'Password is required.',
	}),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage: React.FC = () => {
	const navigate = useNavigate();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (values: LoginFormValues) => {
		const credentials: LoginDto = values;

		try {
			const result = await authService.login(credentials);
			console.log('Login successful:', result);
			toast.success('Login Successful', {
				description: 'Welcome back to your dashboard!',
				classNames: {
					toast: 'bg-green-500 text-white',
					description: 'text-white/80',
					actionButton: 'bg-white text-green-500',
				},
			});
			navigate('/dashboard');
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			const errorMessage =
				error.response?.data?.message ||
				'Login failed. Please check your credentials.';

			toast.error('Login Failed', {
				description: errorMessage,
				classNames: {
					toast: 'bg-red-500 text-white',
					description: 'text-white/80',
					actionButton: 'bg-white text-red-500',
				},
			});
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 px-4'>
			<div className='w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg backdrop-blur-sm border border-gray-200'>
				<h2 className='text-3xl font-extrabold text-center text-gray-900'>
					Welcome Back
				</h2>
				<p className='text-center text-sm text-gray-500'>
					Sign in to manage your income, expenses, and savings.
				</p>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
						{/* Email Field */}
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input placeholder='you@example.com' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password Field */}
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type='password' placeholder='••••••••' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit Button */}
						<Button
							type='submit'
							className='w-full mt-2'
							disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? (
								<>
									<span className='mr-2'>
										<svg
											className='animate-spin h-4 w-4'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V4A10 10 0 1020 12H4z'></path>
										</svg>
									</span>
									Logging in...
								</>
							) : (
								'Login'
							)}
						</Button>
					</form>
				</Form>

				{/* Register Link */}
				<p className='text-center text-sm text-gray-600'>
					Don't have an account?{' '}
					<a
						href='/register'
						className='font-medium text-blue-600 hover:text-blue-500 transition-colors'>
						Register here
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
