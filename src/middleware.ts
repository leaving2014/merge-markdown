import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import {
	defaultLocale,
	localePrefix,
	locales,
	pathnames
} from './config/next-intl.config';

const intlMiddleware = createMiddleware({
	defaultLocale,
	locales,
	pathnames,
	localePrefix,
	localeDetection: true
});

const APEX_HOST = 'mergemarkdown.com';
const CANONICAL_HOST = 'www.mergemarkdown.com';

function isApexRedirectEnabled(): boolean {
	return process.env.AEO_APEX_REDIRECT !== '0';
}

export default function middleware(request: NextRequest) {
	const hostHeader = request.headers.get('host') ?? '';
	const hostname = hostHeader.split(':')[0]?.toLowerCase() ?? '';

	// Fallback apex -> www redirect. Primary redirect lives in
	// Cloudflare Bulk Redirects; this only covers paths that reach Next.js.
	if (isApexRedirectEnabled() && hostname === APEX_HOST) {
		const url = request.nextUrl.clone();
		url.hostname = CANONICAL_HOST;
		url.protocol = 'https:';
		return NextResponse.redirect(url, 301);
	}

	return intlMiddleware(request);
}

export const config = {
	matcher: [
		// Match all pathnames except for
		// - … if they start with `/api`, `/_next` or `/_vercel`
		// - … the ones containing a dot (e.g. `favicon.ico`)
		'/((?!api|_next|_vercel|.*\\..*).*)'
	]
};
