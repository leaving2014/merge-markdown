import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
import HomePage from '@/components/HomePage'

const siteUrl = 'https://www.mergemarkdown.com'

export const metadata: Metadata = {
	title: 'Merge Markdown - Batch Markdown Merge Tool',
	description: 'Merge Multiple Markdown Files into One for Free',
	keywords: 'MarkdownMerge, BatchMerge, MarkdownOnlineMerge',
	icons: {
		icon: '/favicon.png',
		shortcut: '/favicon.png',
		apple: '/favicon.png'
	},
	openGraph: {
		title: 'Merge Markdown - Batch Markdown Merge Tool',
		description: 'Merge Multiple Markdown Files into One for Free',
		url: siteUrl,
		locale: 'en',
		type: 'website',
		images: [
			{
				url: `${siteUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: 'Merge Markdown - Batch Markdown Merge Tool'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Merge Markdown - Batch Markdown Merge Tool',
		description: 'Merge Multiple Markdown Files into One for Free',
		images: [`${siteUrl}/og-image.png`]
	},
	alternates: {
		canonical: siteUrl,
		languages: {
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

export default async function RootPage() {
	unstable_setRequestLocale('en')
	const messages = (await import('../../messages/en.json')).default

	return (
		<NextIntlClientProvider locale='en' messages={messages}>
			<HomePage />
		</NextIntlClientProvider>
	)
}
