import '../style/globals.css'
import { Montserrat } from 'next/font/google'
import Analytics from '@/components/Analytics'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import { getLocale } from 'next-intl/server'

const monserrat = Montserrat({ subsets: ['latin'] })

export const localeToHtmlLang = {
  en: "en",
  ja: "ja",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  ko: "ko",
  ru: "ru",
  fr: "fr",
  de: "de",
  es: "es",
  pt: "pt",
  hi: "hi"
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()
	const htmlLang = localeToHtmlLang[locale as keyof typeof localeToHtmlLang] || "en"

	return (
		<html lang={htmlLang}>
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
