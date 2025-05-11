import authService from '../services/authService';

const UserInfoDisplay: React.FC = () => {
	const user = authService.getCurrentUser();

	if (!user) {
		return null;
	}

	return (
		<div className='flex items-center space-x-2 p-2 mb-4'>
			<div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>
				{user.name ? user.name.charAt(0).toUpperCase() : 'U'}
			</div>
			<span className='text-lg font-semibold'>{user.name || 'User'}</span>
		</div>
	);
};

export default UserInfoDisplay;
