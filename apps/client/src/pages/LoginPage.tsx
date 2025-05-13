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
				description: 'Welcome back!',
			});
			navigate('/dashboard');
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			console.error('Login error:', error);
			const errorMessage =
				error.response?.data?.message ||
				'Login failed. Please check your credentials.';
			toast.error('Login Failed', {
				description: errorMessage,
			});
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md'>
				<h2 className='text-2xl font-bold text-center'>
					Login to Your Account
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
							{form.formState.isSubmitting ? 'Logging in...' : 'Login'}
						</Button>
					</form>
				</Form>

				<p className='text-center text-sm text-gray-600'>
					Don't have an account?{' '}
					<a
						href='/register'
						className='font-medium text-blue-600 hover:underline'>
						Register here
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
