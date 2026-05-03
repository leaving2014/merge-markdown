import { createNavigation } from 'next-intl/navigation'

import { localePrefix, locales, pathnames } from './config/next-intl.config'
import { defaultLocale } from '@/i18n/i18n'

export const { Link, getPathname, redirect, usePathname, useRouter } =
	createNavigation({
		locales,
		defaultLocale,
		pathnames,
		localePrefix
	})
