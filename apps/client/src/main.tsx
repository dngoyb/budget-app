import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'sonner';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RegistrationPage from './pages/RegistrationPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import BudgetSetupPage from './pages/BudgetSetupPage.tsx';
import ExpenseEntryPage from './pages/ExpenseEntryPage.tsx';

import ProtectedRoute from './components/ProtectedRoute.tsx';

const BudgetDetailsPage = () => <h2>Budget Details (Protected)</h2>;
const ExpensesListPage = () => <h2>Expenses List (Protected)</h2>;

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
					<Route path='/expenses/add' element={<ExpenseEntryPage />} />

					<Route path='/budget/details' element={<BudgetDetailsPage />} />
					<Route path='/expenses' element={<ExpensesListPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
