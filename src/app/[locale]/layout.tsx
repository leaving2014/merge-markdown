import type { Metadata } from 'next'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
import { locales } from '@/config/next-intl.config'
import { notFound } from 'next/navigation'

interface IRootLayoutProps {
	children: React.ReactNode
	params: { locale: string }
}

interface LayoutProps {
	children: React.ReactNode
	params: { locale: string };
}

export const runtime = "edge";

export async function generateMetadata({ params }: Pick<LayoutProps, 'params'>
): Promise<Metadata> {
	const  { locale }  = params
	if (!locales.includes(locale as typeof locales[number])) notFound()

	// 导入对应语言的字典
	const dict = await import(`../../../messages/${locale}.json`).then(module => module.default)
	const siteUrl = 'https://www.mergemarkdown.com'

	// 构建语言替代链接对象
	const languageAlternates = {
		en: siteUrl,
		'zh-CN': `${siteUrl}/zh-CN`,
		'zh-TW': `${siteUrl}/zh-TW`,
		ja: `${siteUrl}/ja`,
		ko: `${siteUrl}/ko`,
		ru: `${siteUrl}/ru`,
		fr: `${siteUrl}/fr`,
		de: `${siteUrl}/de`,
		es: `${siteUrl}/es`,
		pt: `${siteUrl}/pt`,
		'x-default': siteUrl
	}
	const canonicalUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`

	return {
		title: dict.metadata.title,
		description: dict.metadata.description,
		keywords: dict.metadata.keywords,
		icons: {
			icon: '/favicon.png',
			shortcut: '/favicon.png',
			apple: '/favicon.png'
		},
		openGraph: {
			title: dict.metadata.title,
			description: dict.metadata.description,
			url: canonicalUrl,
			locale: locale,
			type: 'website',
			images: [
				{
					url: 'https://www.mergemarkdown.com/og-image.png',
					width: 1200,
					height: 630,
					alt: dict.metadata.title
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: dict.metadata.title,
			description: dict.metadata.description,
			images: ['https://www.mergemarkdown.com/og-image.png']
		},
		alternates: {
			canonical: canonicalUrl,
			languages: languageAlternates
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1
			}
		}
	}
}

export default function RootLayout({
	children,
	params: { locale }
}: Readonly<IRootLayoutProps>) {
	if (!locales.includes(locale as typeof locales[number])) notFound()
	unstable_setRequestLocale(locale)
	const messages = useMessages()

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	)
}
