import { locales } from '@/config/next-intl.config'
import { GUIDE_SLUGS, buildGuideMarkdown, getGuide } from '@/lib/aeo-content'

export const runtime = 'edge'

type GuideMdRouteContext = {
	params: { locale: string; slug: string }
}

export function generateStaticParams(): { locale: string; slug: string }[] {
	return locales.flatMap(locale =>
		GUIDE_SLUGS.map(slug => ({ locale, slug }))
	)
}

/**
 * Markdown copy of a guide page, rendered from the same content source
 * as the HTML page. Stable, citable, and crawlable without JavaScript.
 */
export function GET(_request: Request, { params }: GuideMdRouteContext) {
	const result = getGuide(params.locale, params.slug)
	if (!result) {
		return new Response('Not found', {
			status: 404,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' }
		})
	}
	return new Response(buildGuideMarkdown(result.guide), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	})
}
