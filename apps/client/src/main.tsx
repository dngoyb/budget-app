import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const BudgetPage = () => <h2>Budget (Protected)</h2>;
const ExpensesPage = () => <h2>Expenses (Protected)</h2>;

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Toaster position='top-center' />
			<Routes>
				<Route path='/register' element={<RegistrationPage />} />
				<Route path='/login' element={<LoginPage />} />

				<Route element={<ProtectedRoute />}>
					<Route path='/dashboard' element={<DashboardPage />} />
					<Route path='/budget' element={<BudgetPage />} />
					<Route path='/expenses' element={<ExpensesPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
