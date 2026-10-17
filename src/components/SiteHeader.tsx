'use client'

import Image from 'next/image'
import Link from 'next/link'

import LocaleSwitcher from '@/components/ui/language-switcher'

// Shared fixed top bar. HomePage and the changelog page render it so the site
// chrome stays consistent across routes. Callers must offset content with
// `pt-24` (or similar) because the header is `fixed`.
// It must be a client component: LocaleSwitcher uses hooks but doesn't declare
// 'use client' itself, so it relies on this client boundary.
export default function SiteHeader() {
	return (
		<header className='fixed left-0 right-0 top-0 z-10 bg-white shadow-sm dark:bg-gray-800'>
			<div className='container mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 font-mono text-sm sm:px-6 lg:px-8'>
				<Link
					href='https://www.mergemarkdown.com'
					className='flex items-center gap-2'
				>
					<div className='relative h-7 w-12'>
						<Image
							src='/logo.svg'
							alt='Merge Markdown Logo'
							width={36}
							height={36}
							className='object-contain'
							priority
						/>
					</div>
					<span className='hidden text-lg font-semibold text-gray-800 sm:block dark:text-gray-100'>
						Merge Markdown
					</span>
				</Link>
				<div className='flex items-center'>
					<LocaleSwitcher />
				</div>
			</div>
		</header>
	)
}
