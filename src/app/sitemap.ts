import type { MetadataRoute } from 'next';

import { locales } from '@/i18n/i18n';

export const CANONICAL_BASE = 'https://www.mergemarkdown.com';

// Stable last-modified for URLs without their own content timestamp.
// Update this date only when site-wide content actually changes,
// so sitemap output is identical across rebuilds.
export const SITE_LAST_MODIFIED = '2026-09-08';

// Guide slugs shared with src/lib/aeo-content.ts (step 5 builds the pages).
// Kept here as placeholders so sitemap structure lands before content pages.
const GUIDE_SLUGS = [
	'how-to-merge-markdown-files',
	'merge-markdown-online-vs-command-line',
	'use-cases',
] as const;

const GUIDE_LOCALES = ['en', 'zh-CN'] as const;

function localizedUrl(locale: string, path: string): string {
	return locale === 'en'
		? `${CANONICAL_BASE}${path}`
		: `${CANONICAL_BASE}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
	const localePages: MetadataRoute.Sitemap = locales.map((locale) => ({
		url: localizedUrl(locale, '/'),
		lastModified: SITE_LAST_MODIFIED,
		changeFrequency: 'weekly',
		priority: 1.0,
		alternates: {
			languages: Object.fromEntries(
				locales.map((l) => [l, localizedUrl(l, '/')]),
			),
		},
	}));

	const guidePages: MetadataRoute.Sitemap = GUIDE_SLUGS.flatMap((slug) =>
		GUIDE_LOCALES.map((locale) => ({
			url: localizedUrl(locale, `/guide/${slug}`),
			lastModified: SITE_LAST_MODIFIED,
			changeFrequency: 'monthly' as const,
			priority: 0.8,
			alternates: {
				languages: Object.fromEntries(
					GUIDE_LOCALES.map((l) => [l, localizedUrl(l, `/guide/${slug}`)]),
				),
			},
		})),
	);

	return [...localePages, ...guidePages];
}
