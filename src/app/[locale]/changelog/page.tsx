import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'
import { locales } from '@/config/next-intl.config'
import { CHANGELOG } from '@/lib/changelog'

export const runtime = 'edge'

const CANONICAL_BASE = 'https://www.mergemarkdown.com'

type ChangelogPageProps = {
	params: { locale: string }
}

// zh* locales read the Chinese copy, everything else falls back to English.
// This mirrors the single-source bilingual model in changelog.ts, so the page
// needs no per-locale message keys for its body.
function pick(locale: string): 'zh' | 'en' {
	return locale.startsWith('zh') ? 'zh' : 'en'
}

function canonicalUrl(locale: string): string {
	return locale === 'en'
		? `${CANONICAL_BASE}/changelog`
		: `${CANONICAL_BASE}/${locale}/changelog`
}

export function generateStaticParams(): { locale: string }[] {
	return locales.map(locale => ({ locale }))
}

export function generateMetadata({ params }: ChangelogPageProps): Metadata {
	const { locale } = params
	const lang = pick(locale)
	const title = lang === 'zh' ? '更新日志' : 'Changelog'
	const description =
		lang === 'zh'
			? 'Merge Markdown 的功能更新与改进记录。'
			: 'Feature updates and improvements to Merge Markdown.'
	const canonical = canonicalUrl(locale)

	return {
		title,
		description,
		alternates: {
			canonical,
			languages: {
				en: canonicalUrl('en'),
				'zh-CN': canonicalUrl('zh-CN')
			}
		},
		openGraph: {
			title,
			description,
			url: canonical,
			type: 'website'
		}
	}
}

export default function ChangelogPage({ params }: ChangelogPageProps) {
	if (!locales.includes(params.locale as (typeof locales)[number])) {
		notFound()
	}
	const { locale } = params
	const lang = pick(locale)
	const homePath = locale === 'en' ? '/' : `/${locale}`

	const heading = lang === 'zh' ? '更新日志' : 'Changelog'
	const intro =
		lang === 'zh'
			? 'Merge Markdown 的功能更新与改进记录。'
			: 'Feature updates and improvements to Merge Markdown.'
	const backHome = lang === 'zh' ? '返回首页' : 'Home'

	return (
		<div className='flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900'>
			<SiteHeader />
			<main className='mx-auto w-full max-w-3xl flex-1 px-4 pb-12 pt-24'>
				<nav aria-label='Breadcrumb' className='mb-6 text-sm text-gray-500'>
					<Link href={homePath} className='hover:underline'>
						{backHome}
					</Link>
					<span aria-hidden='true'> / </span>
					<span aria-current='page'>{heading}</span>
				</nav>

				<h1 className='mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
					{heading}
				</h1>
				<p className='mb-10 text-gray-600 dark:text-gray-300'>{intro}</p>

				<div className='space-y-10'>
					{CHANGELOG.map(release => (
						<section key={release.date}>
							<time
								dateTime={release.date}
								className='mb-3 block text-sm font-medium text-gray-400 dark:text-gray-500'
							>
								{release.date}
							</time>
							<div className='space-y-6'>
								{release.sections.map(section => (
									<div key={section.heading[lang]}>
										<h2 className='mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100'>
											{section.heading[lang]}
										</h2>
										<ul className='space-y-2'>
											{section.bullets.map(bullet => (
												<li
													key={bullet[lang]}
													className='flex gap-2 leading-7 text-gray-600 dark:text-gray-300'
												>
													<span className='mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500' />
													<span>{bullet[lang]}</span>
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</section>
					))}
				</div>
			</main>
			<Footer />
		</div>
	)
}
