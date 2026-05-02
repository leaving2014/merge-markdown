import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// Can be imported from a shared config
export const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'pt']

export const localeNames = {
	en: 'English',
	'zh-CN': '简体中文',
	'zh-TW': '繁體中文',
	ja: '日本語',
	ko: '한국어',
	ru: 'Русский',
	fr: 'Français',
	de: 'Deutsch',
	es: 'Español',
	pt: 'Português'
}

export const defaultLocale = 'en'

export default getRequestConfig(async ({ locale }) => {
	const requestLocale = locale || defaultLocale

	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(requestLocale as string)) notFound()

	return {
		messages: (await import(`../../messages/${requestLocale}.json`)).default,
	}
})
