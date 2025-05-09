import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

interface ProtectedRouteProps {}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
	const isAuthenticated = authService.isAuthenticated();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
