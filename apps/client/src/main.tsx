import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme-provider';

// Pages
import RegistrationPage from './pages/RegistrationPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import AddIncomePage from './pages/AddIncomePage.tsx'; // renamed from BudgetSetupPage
import ExpenseEntryPage from './pages/ExpenseEntryPage.tsx';
import ExpenseListPage from './pages/ExpenseListPage.tsx';
import MonthlySummaryPage from './pages/MonthlySummaryPage.tsx'; // renamed from BudgetDetailsPage
import AddSavingsPage from './pages/AddSavingsPage.tsx'; // new page
import NotFoundPage from './pages/NotFoundPage.tsx';

// Components
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AuthenticatedLayout from './components/AuthenticatedLayout.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme='light' storageKey='budget-app-theme'>
			<BrowserRouter>
				<Toaster position='top-center' />

				<Routes>
					<Route path='/register' element={<RegistrationPage />} />
					<Route path='/login' element={<LoginPage />} />

					<Route element={<ProtectedRoute />}>
						<Route element={<AuthenticatedLayout />}>
							<Route index element={<DashboardPage />} />
							<Route path='/dashboard' element={<DashboardPage />} />

							{/* Income */}
							<Route path='/income/add' element={<AddIncomePage />} />
							<Route
								path='/incomes/:year/:month'
								element={<MonthlySummaryPage />}
							/>

							{/* Savings */}
							<Route path='/savings/add' element={<AddSavingsPage />} />
							<Route
								path='/savings/:year/:month'
								element={<MonthlySummaryPage />}
							/>

							{/* Summary */}
							<Route path='/summary' element={<MonthlySummaryPage />} />
							<Route
								path='/summary/:year/:month'
								element={<MonthlySummaryPage />}
							/>

							{/* Optional: Legacy Dashboard Summary Route */}
							<Route
								path='/dashboard/monthly-summary/:year/:month'
								element={<MonthlySummaryPage />}
							/>

							{/* Expenses */}
							<Route path='/expenses/add' element={<ExpenseEntryPage />} />
							<Route path='/expenses' element={<ExpenseListPage />} />
						</Route>
					</Route>

					<Route path='*' element={<NotFoundPage />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);
