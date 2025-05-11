import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800'>
			<h1 className='text-4xl font-bold mb-4'>404</h1>
			<p className='text-xl mb-8'>Page Not Found</p>
			<p className='mb-8 text-center'>
				The page you are looking for might have been removed, had its name
				changed, or is temporarily unavailable.
			</p>
			<Link to='/dashboard' className='text-blue-600 hover:underline text-lg'>
				Go to Dashboard
			</Link>
		</div>
	);
};

export default NotFoundPage;
