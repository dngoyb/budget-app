import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import authService from '../services/authService';
import type { CreateUserDto } from '../types/auth';
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

// Zod schema for validation
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
		try {
			const result = await authService.register(values as CreateUserDto);
			localStorage.setItem('token', result.token);

			toast.success('Registration Successful', {
				description: 'Your account has been created.',
			});

			navigate('/dashboard');
		} catch (err) {
			const error = err as AxiosError;
			const errorMessage =
				error.response?.status === 409
					? 'This email is already registered.'
					: 'Registration failed. Please try again.';

			toast.error('Registration Failed', {
				description: errorMessage,
			});
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-background px-4'>
			<div className='w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-xl shadow-lg border border-border'>
				<div className='text-center'>
					<h2 className='text-3xl font-extrabold text-foreground'>
						Create Account
					</h2>
					<p className='mt-2 text-sm text-muted-foreground'>
						Join us and start managing your finances today.
					</p>
				</div>

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

						{/* Name Field */}
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input placeholder='John Doe' {...field} />
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
							{form.formState.isSubmitting ? 'Creating Account...' : 'Sign Up'}
						</Button>
					</form>
				</Form>

				{/* Login Link */}
				<p className='text-center text-sm text-muted-foreground'>
					Already have an account?{' '}
					<a
						href='/login'
						className='font-medium text-blue-600 hover:text-blue-500 transition-colors'>
						Log in
					</a>
				</p>
			</div>
		</div>
	);
};

export default RegistrationPage;
