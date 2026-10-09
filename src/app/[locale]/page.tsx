import { getMessages, getTranslations } from 'next-intl/server'

import HomeSeo from '@/components/HomeSeo'
import HomePage from '@/components/HomePage'
import { buildHomeJsonLd, HOME_FAQ_IDS } from '@/lib/aeo-jsonld'
import type { HomeFaq } from '@/lib/aeo-jsonld'

type HomeRouteProps = {
	params: { locale: string }
}

const CANONICAL_BASE = 'https://www.mergemarkdown.com'

export default async function Home({ params: { locale } }: HomeRouteProps) {
	const t = await getTranslations({ locale, namespace: 'Index' })
	const canonicalUrl =
		locale === 'en' ? CANONICAL_BASE : `${CANONICAL_BASE}/${locale}`

	// Single source of truth for homepage FAQs: read raw messages so locales
	// missing faq7+ keys (e.g. de) fall back to however many entries exist,
	// mirroring the client-side `t.has` guard in HomePage. `t.has` itself is
	// stubbed to always-true in production builds, so it can't be used here.
	const rawMessages = await getMessages({ locale })
	const indexMessages: Record<string, unknown> =
		typeof rawMessages === 'object' &&
		rawMessages !== null &&
		typeof (rawMessages as Record<string, unknown>).Index === 'object'
			? ((rawMessages as Record<string, unknown>).Index as Record<string, unknown>)
			: {}
	const faqs: HomeFaq[] = HOME_FAQ_IDS.flatMap((n): HomeFaq[] => {
		const question = indexMessages[`faq${n}Q`]
		const answer = indexMessages[`faq${n}A`]
		if (
			typeof question !== 'string' ||
			typeof answer !== 'string' ||
			!question ||
			!answer
		) {
			return []
		}
		return [{ question, answer }]
	})

	const jsonLd = buildHomeJsonLd({
		locale,
		canonicalUrl,
		siteName: t('title'),
		description: t('description'),
		faqs,
		steps: [
			{ name: t('selectFiles'), text: t('faq2A') },
			{ name: t('merge'), text: t('faq3A') },
			{ name: t('download'), text: t('faq6A') }
		]
	})

	return (
		<>
			<HomeSeo locale={locale} faqs={faqs} />
			<HomePage />
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</>
	)
}
