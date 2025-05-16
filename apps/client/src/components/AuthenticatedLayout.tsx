import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import UserInfoDisplay from './UserInfoDisplay';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';

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
		<div className='min-h-screen bg-background flex'>
			{/* Sidebar */}
			<aside className='w-64 bg-sidebar text-sidebar-foreground shadow-md h-full fixed inset-y-0 left-0 z-10'>
				<div className='flex flex-col h-full justify-between'>
					<div>
						{/* Logo / App Title */}
						<div className='p-4 border-b border-sidebar-border'>
							<h1 className='text-xl font-bold text-sidebar-primary'>
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
											? 'bg-sidebar-accent text-sidebar-accent-foreground'
											: 'text-sidebar-foreground hover:bg-sidebar-accent/50'
									}`}>
									<span>{link.icon}</span>
									<span>{link.name}</span>
								</Link>
							))}
						</nav>
					</div>

					{/* Theme Toggle and Logout */}
					<div className='p-4 space-y-2'>
						<div className='flex items-center justify-between px-3 py-2'>
							<span className='text-sidebar-foreground'>Theme</span>
							<ThemeToggle />
						</div>
						<Button variant='outline' onClick={handleLogout} className='w-full'>
							🔐 Logout
						</Button>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className='flex-1 ml-64 p-6 bg-background min-h-screen'>
				<div className='max-w-4xl mx-auto bg-card text-card-foreground rounded-lg shadow-md p-6'>
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default AuthenticatedLayout;
