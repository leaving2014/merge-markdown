import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import HomePage from '@/components/HomePage'
import { localeNames, localeToOgLocale } from "@/i18n/i18n"

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
		locale: localeToOgLocale['en'] || 'en_US',
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
		canonical: siteUrl
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
	setRequestLocale('en')
	const messages = (await import('../../messages/en.json')).default

	return (
		<NextIntlClientProvider locale='en' messages={messages}>
			<HomePage />
		</NextIntlClientProvider>
	)
}
