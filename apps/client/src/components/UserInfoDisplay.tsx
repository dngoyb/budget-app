import authService from '../services/authService';
import { UserCircle } from 'lucide-react'; // Import the Lucide icon

const UserInfoDisplay: React.FC = () => {
	const user = authService.getCurrentUser();

	if (!user) {
		return null;
	}

	return (
		<div className='flex items-center space-x-3 p-3 '>
			<UserCircle
				className={`w-8 h-8 ${user.name ? 'text-blue-500' : 'text-gray-400'}`}
			/>

			<div className='flex flex-col'>
				<span className='font-medium text-gray-900'>
					{user.name || 'Guest User'}
				</span>
				{user.email && (
					<span className='text-xs text-gray-500'>{user.email}</span>
				)}
			</div>
		</div>
	);
};

export default UserInfoDisplay;
