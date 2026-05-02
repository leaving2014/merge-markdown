import createMiddleware from 'next-intl/middleware'

import {
	defaultLocale,
	localePrefix,
	locales,
	pathnames
} from './config/next-intl.config'

export default createMiddleware({
	defaultLocale,
	locales,
	pathnames,
	localePrefix,
	localeDetection: true
})

export const config = {
	matcher: [
		// Set a cookie to remember the previous locale for
		// all requests that have a locale prefix
		'/(en)/:path*',

		// Enable redirects that add missing locales
		// (e.g. `/pathnames` -> `/en/pathnames`)
		'/((?!_next|_vercel|.*\\..*).+)'
	]
}
