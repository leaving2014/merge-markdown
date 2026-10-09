import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked } from 'marked'

import { locales } from '@/config/next-intl.config'
import { buildGuideJsonLd } from '@/lib/aeo-jsonld'
import {
	GUIDE_SLUGS,
	getGuide,
	guideCanonicalUrl,
	guideMarkdownPath,
	guideMarkdownUrl,
	localeHomeUrl
} from '@/lib/aeo-content'

export const runtime = 'edge'

type GuidePageProps = {
	params: { locale: string; slug: string }
}

export function generateStaticParams(): { locale: string; slug: string }[] {
	return locales.flatMap(locale =>
		GUIDE_SLUGS.map(slug => ({ locale, slug }))
	)
}

export function generateMetadata({ params }: GuidePageProps): Metadata {
	const result = getGuide(params.locale, params.slug)
	if (!result) {
		return {}
	}
	const canonical = guideCanonicalUrl(params.locale, params.slug)
	return {
		title: result.guide.title,
		description: result.guide.description,
		alternates: {
			canonical,
			languages: {
				en: guideCanonicalUrl('en', params.slug),
				'zh-CN': guideCanonicalUrl('zh-CN', params.slug)
			}
		},
		openGraph: {
			title: result.guide.title,
			description: result.guide.description,
			url: canonical,
			type: 'article'
		}
	}
}

export default function GuidePage({ params }: GuidePageProps) {
	if (!locales.includes(params.locale as (typeof locales)[number])) {
		notFound()
	}
	const result = getGuide(params.locale, params.slug)
	if (!result) {
		notFound()
	}
	const { guide, contentLocale } = result
	const canonical = guideCanonicalUrl(params.locale, params.slug)
	const homeUrl = localeHomeUrl(params.locale)
	const homePath = params.locale === 'en' ? '/' : `/${params.locale}`

	// marked.parse is synchronous here (no async option set), mirroring HomePage.
	// The body source keeps its own H1 so the Markdown copy is standalone;
	// the HTML page already renders the title above, so drop the first H1
	// to keep exactly one <h1> per page.
	const bodyWithoutH1 = guide.bodyMarkdown.replace(/^# .*\r?\n/, '')
	const bodyHtml = String(marked.parse(bodyWithoutH1))

	const jsonLd = buildGuideJsonLd({
		locale: contentLocale,
		canonicalUrl: canonical,
		title: guide.title,
		description: guide.description,
		markdownUrl: guideMarkdownUrl(params.locale, params.slug),
		updatedAt: guide.updatedAt,
		homeUrl,
		faqs: guide.faqs
	})

	return (
		<main className='mx-auto w-full max-w-3xl px-4 py-10'>
			<nav aria-label='Breadcrumb' className='mb-6 text-sm text-gray-500'>
				<Link href={homePath} className='hover:underline'>
					Home
				</Link>
				<span aria-hidden='true'> / </span>
				<span aria-current='page'>{guide.title}</span>
			</nav>
			<h1 className='mb-3 text-3xl font-bold tracking-tight'>{guide.title}</h1>
			<p className='mb-2 text-lg text-gray-600'>{guide.description}</p>
			<p className='mb-8 text-sm text-gray-500'>
				<time dateTime={guide.updatedAt}>{guide.updatedAt}</time>
				{' · '}
				<a
					href={guideMarkdownPath(params.locale, params.slug)}
					className='underline hover:text-gray-800'
				>
					Markdown version
				</a>
			</p>
			<article
				className='space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:px-2 [&_th]:py-1 [&_ul]:list-disc [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1'
				dangerouslySetInnerHTML={{ __html: bodyHtml }}
			/>
			<section aria-label='FAQ' className='mt-10 border-t pt-6'>
				<h2 className='mb-4 text-2xl font-semibold'>FAQ</h2>
				<div className='space-y-5'>
					{guide.faqs.map(faq => (
						<article key={faq.question}>
							<h3 className='font-semibold'>{faq.question}</h3>
							<p className='mt-1 text-gray-700'>{faq.answer}</p>
						</article>
					))}
				</div>
			</section>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</main>
	)
}
