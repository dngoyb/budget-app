import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Toaster } from 'sonner';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RegistrationPage from './pages/RegistrationPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import BudgetSetupPage from './pages/BudgetSetupPage.tsx';
import ExpenseEntryPage from './pages/ExpenseEntryPage.tsx';
import ExpenseListPage from './pages/ExpenseListPage.tsx';
import BudgetDetailsPage from './pages/BudgetDetailsPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

import ProtectedRoute from './components/ProtectedRoute.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Toaster position='top-center' />

			<Routes>
				<Route path='/register' element={<RegistrationPage />} />
				<Route path='/login' element={<LoginPage />} />

				<Route element={<ProtectedRoute />}>
					<Route path='/dashboard' element={<DashboardPage />} />
					<Route path='/budget/setup' element={<BudgetSetupPage />} />
					<Route path='/budget/details' element={<BudgetDetailsPage />} />
					<Route path='/expenses/add' element={<ExpenseEntryPage />} />
					<Route path='/expenses' element={<ExpenseListPage />} />
				</Route>
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
