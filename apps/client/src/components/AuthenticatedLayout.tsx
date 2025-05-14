import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import UserInfoDisplay from './UserInfoDisplay';
import { Button } from './ui/button';

const AuthenticatedLayout: React.FC = () => {
	const location = useLocation();

	const handleLogout = () => {
		// Replace this with actual logout logic if needed
		localStorage.removeItem('token');
		window.location.href = '/login';
	};

	const navLinks = [
		{ name: 'Dashboard', path: '/dashboard', icon: '📊' },
		{ name: 'Monthly Summary', path: '/summary', icon: '📅' },
		{ name: 'Add Income', path: '/income/add', icon: '💰' },
		{ name: 'Add Savings', path: '/savings/add', icon: '🏦' },
		{ name: 'Manage Expenses', path: '/expenses', icon: '🧾' },
	];

	return (
		<div className='min-h-screen bg-gray-100 flex'>
			{/* Sidebar */}
			<aside className='w-64 bg-white shadow-md h-full fixed inset-y-0 left-0 z-10'>
				<div className='flex flex-col h-full justify-between'>
					<div>
						{/* Logo / App Title */}
						<div className='p-4 border-b border-gray-200'>
							<h1 className='text-xl font-bold text-blue-600'>
								Finance Tracker
							</h1>
						</div>

						{/* User Info */}
						<UserInfoDisplay />

						{/* Navigation */}
						<nav className='p-4 space-y-1'>
							{navLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={`flex items-center space-x-3 w-full p-3 rounded-md transition-colors ${
										location.pathname === link.path
											? 'bg-blue-100 text-blue-700'
											: 'text-gray-700 hover:bg-gray-100'
									}`}>
									<span>{link.icon}</span>
									<span>{link.name}</span>
								</Link>
							))}
						</nav>
					</div>

					{/* Logout Button */}
					<div className='p-4'>
						<Button variant='outline' onClick={handleLogout} className='w-full'>
							🔐 Logout
						</Button>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className='flex-1 ml-64 p-6 bg-gray-100 min-h-screen'>
				<div className='max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6'>
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default AuthenticatedLayout;
