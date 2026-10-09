export type HomeFaq = {
	question: string
	answer: string
}

export type HomeHowToStep = {
	name: string
	text: string
}

/**
 * FAQ entry ids 1..12. Locales missing a key hide that entry
 * (callers check key presence on raw messages; mirrors the
 * client-side `t.has` fallback in HomePage).
 */
export const HOME_FAQ_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

export type BuildHomeJsonLdInput = {
	locale: string
	canonicalUrl: string
	siteName: string
	description: string
	faqs: HomeFaq[]
	steps: HomeHowToStep[]
}

type JsonLdNode = Record<string, unknown>

const CONTEXT = 'https://schema.org'

function buildSoftwareApplication(
	input: BuildHomeJsonLdInput
): JsonLdNode {
	return {
		'@context': CONTEXT,
		'@type': 'SoftwareApplication',
		name: input.siteName,
		url: input.canonicalUrl,
		inLanguage: input.locale,
		description: input.description,
		applicationCategory: 'UtilitiesApplication',
		operatingSystem: 'WebBrowser',
		isAccessibleForFree: true,
		offers: {
			'@type': 'Offer',
			price: 0,
			priceCurrency: 'USD'
		}
	}
}

function buildFaqPage(faqs: HomeFaq[], locale: string): JsonLdNode {
	return {
		'@context': CONTEXT,
		'@type': 'FAQPage',
		inLanguage: locale,
		mainEntity: faqs.map(faq => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	}
}

function buildHowTo(
	input: BuildHomeJsonLdInput
): JsonLdNode {
	return {
		'@context': CONTEXT,
		'@type': 'HowTo',
		inLanguage: input.locale,
		name: input.siteName,
		description: input.description,
		step: input.steps.map((step, index) => ({
			'@type': 'HowToStep',
			position: index + 1,
			name: step.name,
			text: step.text
		}))
	}
}

function buildBreadcrumb(canonicalUrl: string): JsonLdNode {
	return {
		'@context': CONTEXT,
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: canonicalUrl
			}
		]
	}
}

export type GuideJsonLdInput = {
	locale: string
	canonicalUrl: string
	title: string
	description: string
	markdownUrl: string
	updatedAt: string
	homeUrl: string
	faqs: HomeFaq[]
}

export type BreadcrumbCrumb = {
	name: string
	url: string
}

function buildArticle(input: GuideJsonLdInput): JsonLdNode {
	return {
		'@context': CONTEXT,
		'@type': 'Article',
		headline: input.title,
		description: input.description,
		inLanguage: input.locale,
		url: input.canonicalUrl,
		dateModified: input.updatedAt,
		isAccessibleForFree: true,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': input.canonicalUrl
		},
		associatedMedia: {
			'@type': 'MediaObject',
			encodingFormat: 'text/markdown',
			contentUrl: input.markdownUrl
		}
	}
}

function buildGuideBreadcrumb(
	crumbs: BreadcrumbCrumb[]
): JsonLdNode {
	return {
		'@context': CONTEXT,
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: crumb.url
		}))
	}
}

/**
 * Build the JSON-LD graph injected on guide content pages (step 5).
 * Article is always present; FAQPage only when the guide has FAQs.
 */
export function buildGuideJsonLd(input: GuideJsonLdInput): JsonLdNode[] {
	const nodes: JsonLdNode[] = [buildArticle(input)]
	if (input.faqs.length > 0) {
		nodes.push(buildFaqPage(input.faqs, input.locale))
	}
	nodes.push(
		buildGuideBreadcrumb([
			{ name: 'Home', url: input.homeUrl },
			{ name: input.title, url: input.canonicalUrl }
		])
	)
	return nodes
}

/**
 * Build the JSON-LD graph injected on the homepage.
 * Content pages (step 5) reuse these builders with their own input.
 */
export function buildHomeJsonLd(input: BuildHomeJsonLdInput): JsonLdNode[] {
	return [
		buildSoftwareApplication(input),
		buildFaqPage(input.faqs, input.locale),
		buildHowTo(input),
		buildBreadcrumb(input.canonicalUrl)
	]
}
