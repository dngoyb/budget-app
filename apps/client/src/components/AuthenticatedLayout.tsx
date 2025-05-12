import React from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import UserInfoDisplay from './UserInfoDisplay';
import { Button } from './ui/button';
import authService from '../services/authService';
import clsx from 'clsx';
import {
	LogOut,
	ChevronDown,
	Home,
	PieChart,
	DollarSign,
	PlusCircle,
	List,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

const AuthenticatedLayout: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		authService.logout();
		navigate('/login');
	};

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;

	const isLinkActive = (pathname: string): boolean => {
		if (pathname.startsWith('/budget/details/')) {
			return location.pathname.startsWith('/budget/details/');
		}
		if (pathname.startsWith('/expenses/add')) {
			return location.pathname.startsWith('/expenses/add');
		}
		if (pathname.startsWith('/budget/setup')) {
			return location.pathname.startsWith('/budget/setup');
		}
		return location.pathname === pathname;
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			<div className='flex justify-between items-center p-4 bg-white shadow-md'>
				<div className='flex items-center space-x-6'>
					<UserInfoDisplay />

					<Link
						to='/dashboard'
						className={clsx(
							'flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md',
							isLinkActive('/dashboard') &&
								'font-medium text-blue-600 bg-blue-50'
						)}>
						<Home className='h-5 w-5' />
						<span>Dashboard</span>
					</Link>
				</div>

				<div className='flex items-center space-x-4'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='flex items-center space-x-1'>
								<span className='font-medium'>Menu</span>
								<ChevronDown className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-56'>
							<DropdownMenuItem
								onClick={() =>
									navigate(`/budget/details/${currentYear}/${currentMonth}`)
								}
								className={clsx(
									'flex items-center space-x-2 cursor-pointer',
									isLinkActive('/budget/details/') && 'bg-blue-50'
								)}>
								<PieChart className='h-4 w-4' />
								<span>Budget Details</span>
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => navigate('/budget/setup')}
								className={clsx(
									'flex items-center space-x-2 cursor-pointer',
									isLinkActive('/budget/setup') && 'bg-blue-50'
								)}>
								<DollarSign className='h-4 w-4' />
								<span>Add Budget</span>
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => navigate('/expenses')}
								className={clsx(
									'flex items-center space-x-2 cursor-pointer',
									isLinkActive('/expenses') && 'bg-blue-50'
								)}>
								<List className='h-4 w-4' />
								<span>Expenses</span>
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => navigate('/expenses/add')}
								className={clsx(
									'flex items-center space-x-2 cursor-pointer',
									isLinkActive('/expenses/add') && 'bg-blue-50'
								)}>
								<PlusCircle className='h-4 w-4' />
								<span>Add Expense</span>
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={handleLogout}
								className='flex items-center space-x-2 text-red-600 hover:bg-red-50 cursor-pointer'>
								<LogOut className='h-4 w-4' />
								<span>Logout</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className='flex-grow container mx-auto p-4'>
				<Outlet />
			</div>
		</div>
	);
};

export default AuthenticatedLayout;
