import React from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import UserInfoDisplay from './UserInfoDisplay';
import { Button } from './ui/button';
import authService from '../services/authService';
import clsx from 'clsx'; // Import clsx for conditional class names
import { LogOut } from 'lucide-react';

const AuthenticatedLayout: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation(); // Get the current location

	const handleLogout = () => {
		authService.logout();
		navigate('/login');
	};

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;

	// Function to check if a link is active
	const isLinkActive = (pathname: string): boolean => {
		// Special handling for budget details link to match /budget/details/:year/:month
		if (pathname.startsWith('/budget/details/')) {
			return location.pathname.startsWith('/budget/details/');
		}
		if (pathname.startsWith('/expenses/add')) {
			return location.pathname.startsWith('/expenses/add');
		}
		// For other links, exact match is usually sufficient
		return location.pathname === pathname;
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			<div className='flex justify-between items-center p-4 bg-white shadow-md'>
				<UserInfoDisplay />

				<nav className='flex items-center space-x-4'>
					<Link
						to='/dashboard'
						className={clsx(
							'text-gray-600 hover:text-blue-600',
							isLinkActive('/dashboard') && 'font-bold text-blue-600' // Apply bold and blue if active
						)}>
						Dashboard
					</Link>
					<Link
						to={`/budget/details/${currentYear}/${currentMonth}`}
						className={clsx(
							'text-gray-600 hover:text-blue-600',
							isLinkActive('/budget/details/') && 'font-bold text-blue-600' // Apply bold and blue if active
						)}>
						Budget
					</Link>
					<Link
						to={`/budget/setup/`}
						className={clsx(
							'text-gray-600 hover:text-blue-600',
							isLinkActive('/budget/setup/') && 'font-bold text-blue-600' // Apply bold and blue if active
						)}>
						Add Budget
					</Link>
					<Link
						to='/expenses'
						className={clsx(
							'text-gray-600 hover:text-blue-600',
							isLinkActive('/expenses') && 'font-bold text-blue-600' // Apply bold and blue if active
						)}>
						Expenses
					</Link>
					<Link
						to='/expenses/add'
						className={clsx(
							'text-gray-600 hover:text-blue-600',
							isLinkActive('/expenses/add') && 'font-bold text-blue-600' // Apply bold and blue if active
						)}>
						Add Expense
					</Link>
				</nav>

				<Button onClick={handleLogout} variant='ghost'>
					<LogOut className='mr-2' />
				</Button>
			</div>

			<div className='flex-grow container mx-auto p-4'>
				<Outlet />
			</div>
		</div>
	);
};

export default AuthenticatedLayout;
