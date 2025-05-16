import { useTheme } from '../../lib/theme-provider';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className='toaster group'
			toastOptions={{
				classNames: {
					toast:
						'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
					description: 'group-[.toast]:text-muted-foreground',
					actionButton:
						'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
					cancelButton:
						'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
					success:
						'group-[.toaster]:!bg-green-100 group-[.toaster]:dark:!bg-green-900 group-[.toaster]:!text-green-700 group-[.toaster]:dark:!text-green-300 group-[.toaster]:!border-green-200 group-[.toaster]:dark:!border-green-800',
					error:
						'group-[.toaster]:!bg-red-100 group-[.toaster]:dark:!bg-red-900 group-[.toaster]:!text-red-700 group-[.toaster]:dark:!text-red-300 group-[.toaster]:!border-red-200 group-[.toaster]:dark:!border-red-800',
					info: 'group-[.toaster]:!bg-blue-100 group-[.toaster]:dark:!bg-blue-900 group-[.toaster]:!text-blue-700 group-[.toaster]:dark:!text-blue-300 group-[.toaster]:!border-blue-200 group-[.toaster]:dark:!border-blue-800',
					warning:
						'group-[.toaster]:!bg-yellow-100 group-[.toaster]:dark:!bg-yellow-900 group-[.toaster]:!text-yellow-700 group-[.toaster]:dark:!text-yellow-300 group-[.toaster]:!border-yellow-200 group-[.toaster]:dark:!border-yellow-800',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
