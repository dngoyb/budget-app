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
		try {
			const result = await authService.login(values as LoginDto);

			// Store the token
			localStorage.setItem('token', result.token);

			// Show success message
			toast.success('Welcome back!', {
				description: 'Successfully logged in.',
			});

			// Redirect to dashboard
			navigate('/dashboard');
		} catch (err) {
			const error = err as AxiosError;
			const errorMessage =
				error.response?.status === 401
					? 'Invalid email or password.'
					: 'An error occurred during login. Please try again.';

			toast.error('Login Failed', {
				description: errorMessage,
			});
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-background px-4'>
			<div className='w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-xl shadow-lg backdrop-blur-sm border border-border'>
				<h2 className='text-3xl font-extrabold text-center text-foreground'>
					Welcome Back
				</h2>
				<p className='text-center text-sm text-muted-foreground'>
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
						<Button type='submit' className='w-full'>
							{form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
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
