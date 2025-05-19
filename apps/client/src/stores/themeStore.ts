import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			theme: 'light',
			setTheme: (theme) => set({ theme }),
		}),
		{
			name: 'budget-app-theme',
		}
	)
);
