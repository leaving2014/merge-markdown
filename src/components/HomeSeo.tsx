import { getTranslations } from 'next-intl/server'

import type { HomeFaq } from '@/lib/aeo-jsonld'

type HomeSeoProps = {
	locale: string
	faqs: HomeFaq[]
}

/**
 * Server-rendered SEO copy for crawlers and no-JS agents.
 * Visually hidden (sr-only) so the interactive tool layout stays unchanged;
 * the text is still present in the raw HTML for curl / crawler reads.
 * FAQ list comes from the caller (same array fed to the JSON-LD builder),
 * so SSR text and structured data are always in sync.
 */
export default async function HomeSeo({ locale, faqs }: HomeSeoProps) {
	const t = await getTranslations({ locale, namespace: 'Index' })

	const features = [t('faq4A'), t('faq3A'), t('faq6A'), t('faq2A')]

	const steps = [
		{ name: t('selectFiles'), text: t('faq2A') },
		{ name: t('merge'), text: t('faq3A') },
		{ name: t('download'), text: t('faq6A') }
	]

	return (
		<section aria-label={t('title')} className='sr-only'>
			<h1>
				{t('title')} — {t('description')}
			</h1>
			<ul>
				{features.map(feature => (
					<li key={feature}>{feature}</li>
				))}
			</ul>
			<h2>{t('merge')}</h2>
			<ol>
				{steps.map(step => (
					<li key={step.name}>
						<strong>{step.name}</strong>: {step.text}
					</li>
				))}
			</ol>
			<h2>{t('faqTitle')}</h2>
			{faqs.map(faq => (
				<article key={faq.question}>
					<h3>{faq.question}</h3>
					<p>{faq.answer}</p>
				</article>
			))}
		</section>
	)
}
