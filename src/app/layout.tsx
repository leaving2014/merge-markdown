import '../style/globals.css'
import { Montserrat } from 'next/font/google'
import Analytics from '@/components/Analytics'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'

const monserrat = Montserrat({ subsets: ['latin'] })

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<link rel='icon' href='/image/favicon.ico' sizes='any' />
			<body className={monserrat.className}>
				<Analytics />
				<ToastProvider>
					{children}
					<Toaster />
				</ToastProvider>
			</body>
		</html>
	)
}
