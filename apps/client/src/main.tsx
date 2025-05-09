import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Toaster position='bottom-right' />
			<Routes>
				<Route path='/register' element={<RegistrationPage />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
