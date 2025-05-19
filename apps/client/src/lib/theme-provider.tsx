import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: 'dark' | 'light';
};

export function ThemeProvider({
	children,
	defaultTheme = 'light',
}: ThemeProviderProps) {
	const { theme, setTheme } = useThemeStore();

	// Set initial theme if not already set
	useEffect(() => {
		if (!theme) {
			setTheme(defaultTheme);
		}
	}, [defaultTheme, setTheme, theme]);

	// Update root class when theme changes
	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(theme);
	}, [theme]);

	return <>{children}</>;
}
