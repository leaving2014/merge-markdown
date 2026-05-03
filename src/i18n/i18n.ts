import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';


// Can be imported from a shared config
export const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'pt']

export const localeNames = [
  { locale: 'en',    path: '/',    label: 'English',    short: 'EN' },
  { locale: 'zh-CN', path: '/zh-CN', label: '简体中文',   short: '简体' },
  { locale: 'zh-TW', path: '/zh-TW', label: '繁體中文',   short: '繁體' },
  { locale: 'ja',    path: '/ja',    label: '日本語',      short: 'JA' },
  { locale: 'ko',    path: '/ko',    label: '한국어',      short: 'KO' },
  { locale: 'ru',    path: '/ru',    label: 'Русский',    short: 'RU' },
  { locale: 'fr',    path: '/fr',    label: 'Français',   short: 'FR' },
  { locale: 'de',    path: '/de',    label: 'Deutsch',    short: 'DE' },
  { locale: 'es',    path: '/es',    label: 'Español',    short: 'ES' },
  { locale: 'pt',    path: '/pt',    label: 'Português',  short: 'PT' },
]

export const localeToHtmlLang: Record<string, string> = {
	en: 'en',
	'zh-CN': 'zh-CN',
	'zh-TW': 'zh-TW',
	ja: 'ja',
	ko: 'ko',
	ru: 'ru',
	fr: 'fr',
	de: 'de',
	es: 'es',
	pt: 'pt'
}

export const localeToOgLocale: Record<string, string> = {
	'en': 'en_US',
	'zh-CN': 'zh_CN',
	'zh-TW': 'zh_TW',
	'ja': 'ja_JP',
	'ko': 'ko_KR',
	'ru': 'ru_RU',
	'fr': 'fr_FR',
	'de': 'de_DE',
	'es': 'es_ES',
	'pt': 'pt_PT',
}

export const defaultLocale = 'en'

export default getRequestConfig(async ({ locale }) => {
	const requestLocale = locale || defaultLocale

	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(requestLocale as string)) notFound()

	return {
		locale: requestLocale,
		messages: (await import(`../../messages/${requestLocale}.json`)).default,
	}
})
