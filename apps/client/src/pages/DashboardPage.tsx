import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import authService from '../services/authService';
import UserInfoDisplay from '../components/UserInfoDisplay';

const DashboardPage: React.FC = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		authService.logout();
		navigate('/login');
	};

	return (
		<div className='flex min-h-screen bg-gray-100'>
			<div className='w-64 p-4 '>
				<UserInfoDisplay />
			</div>
			<div className='container mx-auto p-4 '>
				<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
				<p className='mb-4'>Welcome to your Budget App Dashboard!</p>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='p-4 border rounded shadow'>
						<h3 className='text-lg font-semibold mb-2'>
							Current Month's Budget
						</h3>
						<p>Budget Amount: [Fetch and display budget amount]</p>
						<p>Expenses This Month: [Fetch and display total expenses]</p>
						<p>Remaining: [Calculate and display remaining]</p>
						<Link to='/budget' className='text-blue-600 hover:underline'>
							View Budget Details
						</Link>
					</div>

					<div className='p-4 border rounded shadow'>
						<h3 className='text-lg font-semibold mb-2'>Recent Expenses</h3>
						<ul>
							<li>[Expense 1] - [Amount]</li>
							<li>[Expense 2] - [Amount]</li>
						</ul>
						<Link to='/expenses' className='text-blue-600 hover:underline'>
							View All Expenses
						</Link>
					</div>
				</div>

				<div className='mt-6 text-center'>
					<Button onClick={handleLogout}>Logout</Button>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
