import '../style/globals.css'
import { Montserrat } from 'next/font/google'
import Analytics from '@/components/Analytics'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { localeToHtmlLang, localeNames, localeToOgLocale } from '@/i18n/i18n'

const monserrat = Montserrat({ subsets: ['latin'] })

export default async function RootLayout({
																					 children
																				 }: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()
	const messages = await getMessages()
	const htmlLang = localeToHtmlLang[locale as keyof typeof localeToHtmlLang] || "en"

	const siteUrl = 'https://www.mergemarkdown.com'
	const alternateLinks: { id: string; href: string; hreflang: string }[] = [
		{ id: 'i18n-xd', href: siteUrl, hreflang: 'x-default' }
	]

	localeNames.forEach((l) => {
		const loc = l.locale
		const href = loc === 'en' ? siteUrl : `${siteUrl}/${loc}`

		alternateLinks.push({ id: `i18n-alt-${loc}`, href, hreflang: loc })

		const ogLocaleStr = localeToOgLocale[loc].replace('_', '-')
		if (ogLocaleStr !== loc && !alternateLinks.find(x => x.hreflang === ogLocaleStr)) {
			alternateLinks.push({ id: `i18n-alt-${ogLocaleStr}`, href, hreflang: ogLocaleStr })
		}

		const short = loc.split('-')[0]
		if (short !== loc && !alternateLinks.find(x => x.hreflang === short)) {
			alternateLinks.push({ id: `i18n-alt-${short}`, href, hreflang: short })
		}
	})

	return (
		<html lang={htmlLang}>
		<head>
			{alternateLinks.map((link) => (
				<link
					key={link.hreflang}
					id={link.id}
					rel="alternate"
					href={link.href}
					hreflang={link.hreflang}
				/>
			))}
			{localeNames
				.filter((l) => l.locale !== locale)
				.map((l) => {
					const ogLocale = localeToOgLocale[l.locale]
					return (
						<meta
							key={ogLocale}
							id={`i18n-og-alt-${ogLocale.replace('_', '-')}`}
							property="og:locale:alternate"
							content={ogLocale}
						/>
					)
				})}
		</head>
		<link rel='icon' href='/image/favicon.ico' sizes='any' />
		<body className={monserrat.className}>
		<Analytics />
		<NextIntlClientProvider locale={locale} messages={messages}>
			<ToastProvider>
				{children}
				<Toaster />
			</ToastProvider>
		</NextIntlClientProvider>
		</body>
		</html>
	)
}