import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
			<p className='mb-4'>Welcome to your Budget App Dashboard!</p>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className='p-4 border rounded shadow'>
					<h3 className='text-lg font-semibold mb-2'>Current Month's Budget</h3>
					<p>Budget Amount: [Fetch and display budget amount]</p>
					<p>Expenses This Month: [Fetch and display total expenses]</p>
					<p>Remaining: [Calculate and display remaining]</p>
					{/* Note: Update this link to pass current year/month dynamically */}
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
		</div>
	);
};

export default DashboardPage;
