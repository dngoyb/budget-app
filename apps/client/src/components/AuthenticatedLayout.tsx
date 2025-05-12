import React, { useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import UserInfoDisplay from './UserInfoDisplay';
import { Button } from './ui/button';
import authService from '../services/authService';
import clsx from 'clsx';
import {
	LogOut,
	Home,
	PieChart,
	DollarSign,
	PlusCircle,
	List,
	Menu,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface MenuItem {
	path: string;
	label: string;
	icon: React.ReactNode;
	matchPattern?: string | RegExp;
	className?: string;
}

const AuthenticatedLayout: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;

	const menuItems: MenuItem[] = useMemo(
		() => [
			{
				path: '/dashboard',
				label: 'Dashboard',
				icon: <Home className='h-4 w-4' />,
			},
			{
				path: `/budget/details/${currentYear}/${currentMonth}`,
				label: 'Budget',
				icon: <PieChart className='h-4 w-4' />,
				matchPattern: /^\/budget\/details\/.+/,
			},
			{
				path: '/budget/setup',
				label: 'Add Budget',
				icon: <DollarSign className='h-4 w-4' />,
				matchPattern: /^\/budget\/setup/,
			},
			{
				path: '/expenses',
				label: 'Expenses',
				icon: <List className='h-4 w-4' />,
			},
			{
				path: '/expenses/add',
				label: 'Add Expense',
				icon: <PlusCircle className='h-4 w-4' />,
				matchPattern: /^\/expenses\/add/,
			},
			{
				path: '/logout',
				label: 'Logout',
				icon: <LogOut className='h-4 w-4' />,
				className: 'text-red-600 hover:bg-red-50',
			},
		],
		[currentYear, currentMonth]
	);

	const isLinkActive = (item: MenuItem): boolean => {
		if (item.matchPattern) {
			return new RegExp(item.matchPattern).test(location.pathname);
		}
		return location.pathname === item.path;
	};

	const handleNavigation = (path: string) => {
		if (path === '/logout') {
			try {
				authService.logout();
				navigate('/login');
			} catch (error) {
				console.error('Logout failed:', error);
			}
			return;
		}
		navigate(path);
	};

	const activeSection = useMemo(() => {
		const activeItem = menuItems.find((item) => isLinkActive(item));
		return activeItem?.label || 'Dashboard';
	}, [location.pathname, menuItems]);

	return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			<header className='flex justify-between items-center p-4 bg-white shadow-md'>
				<div className='flex items-center space-x-6'>
					{/* Clickable UserInfoDisplay that navigates to dashboard */}
					<div
						onClick={() => navigate('/dashboard')}
						className='cursor-pointer'>
						<UserInfoDisplay />
					</div>
					<div className='flex items-center space-x-2'>
						<PieChart className='h-6 w-6 text-blue-600' />
						<span className='text-xl font-semibold'>{activeSection}</span>
					</div>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full'
							aria-label='Main menu'
							aria-haspopup='true'>
							<Menu className='h-5 w-5' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align='end'
						className='w-56'
						onCloseAutoFocus={(e) => e.preventDefault()}>
						{menuItems.map((item) => (
							<DropdownMenuItem
								key={item.path}
								onClick={() => handleNavigation(item.path)}
								className={clsx(
									'flex items-center space-x-2 cursor-pointer',
									isLinkActive(item) && 'bg-blue-50',
									item.className
								)}
								aria-current={isLinkActive(item) ? 'page' : undefined}>
								{item.icon}
								<span>{item.label}</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</header>

			<main className='flex-grow container mx-auto p-4'>
				<Outlet />
			</main>
		</div>
	);
};

export default AuthenticatedLayout;
