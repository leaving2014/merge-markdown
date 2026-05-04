import { MetadataRoute } from 'next';
import { locales } from "@/i18n/i18n";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mergemarkdown.com'

export default function sitemap(): MetadataRoute.Sitemap {
	const localePages = locales.map(locale => ({
		url: `${baseUrl}/${locale}/`,
		lastModified: new Date(),
		changeFrequency: 'weekly' as const,
		priority: 1.0
	}))

	return [...localePages]
}