'use client'

import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { useState, useEffect, useTransition, useRef } from 'react'

import { useRouter, usePathname } from '../../../navigation'
import { Check, ChevronDown } from 'lucide-react'

interface Option {
	value: string
	label: string
}

interface ILocaleSwitcherSelect {
	options: Option[]
	defaultValue: string
	label: string
}

export function LocaleSwitcherSelect({ options, defaultValue, label }: ILocaleSwitcherSelect) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const pathname = usePathname()
	const params = useParams()
	const [mounted, setMounted] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	function onSelectChange(nextLocale: string) {
		if (nextLocale === defaultValue) {
			setIsOpen(false)
			return
		}
		
		setIsOpen(false)
		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale }
			)
		})
	}

	if (!mounted) return null

	const currentOption = options.find(opt => opt.value === defaultValue) || options[0]

	return (
		<div className="relative inline-block text-left" ref={containerRef}>
			<button
				type="button"
				className={clsx(
					'inline-flex items-center justify-between gap-1 rounded-md bg-transparent px-2 py-1.5 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 focus:outline-none transition-colors',
					isPending && 'opacity-50 cursor-not-allowed'
				)}
				disabled={isPending}
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<span className="sr-only">{label}</span>
				<span>{currentOption.label}</span>
				<ChevronDown className="h-4 w-4 opacity-50" />
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full z-50 mt-1 max-h-60 w-40 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
					<ul
						className="p-1"
						role="listbox"
						tabIndex={-1}
					>
						{options.map((option) => (
							<li
								key={option.value}
								className={clsx(
									"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100",
									option.value === defaultValue 
										? "bg-gray-50 text-gray-900 font-medium dark:bg-gray-700/50 dark:text-white" 
										: "text-gray-700 dark:text-gray-300"
								)}
								role="option"
								aria-selected={option.value === defaultValue}
								onClick={() => onSelectChange(option.value)}
							>
								{option.value === defaultValue && (
									<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
										<Check className="h-4 w-4" />
									</span>
								)}
								<span>{option.label}</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
