import { Pathnames } from 'next-intl/routing'

export const defaultLocale = 'en' as const
export const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'pt'] as const
export type Locale = typeof locales[number]

export const pathnames = {
	'/': '/',
} satisfies Pathnames<typeof locales>

export const localePrefix = 'as-needed'
