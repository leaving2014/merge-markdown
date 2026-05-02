'use client'
import React, { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, Download } from 'lucide-react'
import LocaleSwitcher from '@/components/ui/language-switcher'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function Home() {
	const t = useTranslations('Index')
	const [files, setFiles] = useState<File[]>([])
	const [mergedContent, setMergedContent] = useState('')
	const { toast } = useToast()

	const handleFilesSelected = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(event.target.files || [])
		setFiles(selectedFiles)
	}, [])

	const handleMerge = async () => {
		if (files.length === 0) {
			toast({
				variant: 'destructive',
				title: t('noFilesSelected')
			})
			return
		}

		try {
			const contents = await Promise.all(
				files.map(file => {
					return new Promise((resolve, reject) => {
						const reader = new FileReader()
						reader.onload = e => resolve(e.target?.result as string)
						reader.onerror = reject
						reader.readAsText(file)
					})
				})
			)
			setMergedContent(contents.join('\n\n'))
		} catch (error) {
			console.error(error)
			toast({
				variant: 'destructive',
				title: t('fileReadError')
			})
		}
	}

	const handleDownload = () => {
		if (!mergedContent) {
			toast({
				variant: 'destructive',
				title: t('noMergedContent')
			})
			return
		}

		const blob = new Blob([mergedContent], { type: 'text/markdown' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'merged.md'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			<header className='fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-10'>
				<div className='container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center z-10 w-full max-w-5xl justify-between font-mono text-sm lg:flex'>
					<Link href='https://www.mergemarkdown.com' className='flex items-center gap-2'>
						<div className='relative w-12 h-7'>
							<Image src='/logo.svg' alt='Merge Markdown Logo' width={36} height={36} className='object-contain' priority />
						</div>
						<span className='font-semibold text-lg hidden sm:block text-gray-800'>Merge Markdown</span>
					</Link>
					<div className='fixed bottom-0  flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:size-auto lg:bg-none dark:from-black dark:via-black'>
						<LocaleSwitcher />
					</div>
				</div>
			</header>

			<main className='pt-24 pb-16 px-4 sm:px-6 lg:px-8 mb-4 max-w-7xl mx-auto'>
				<div className='text-center flex flex-col gap-6 mb-6'>
					<h1 className='text-4xl md:text-6xl font-bold'>{t('title')}</h1>
					<p className='text-base md:text-xl max-w-2xl mx-auto px-4 md:px-0'>{t('description')}</p>
				</div>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
					<div className='flex flex-col items-center gap-6'>
						<label className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors'>
							<div className='flex flex-col items-center justify-center pt-5 pb-6'>
								<Upload className='w-8 h-8 mb-3 text-gray-400' />
								<p className='text-sm text-gray-500 dark:text-gray-400'>{t('selectFiles')}</p>
							</div>
							<input type='file' multiple accept='.md,.markdown' className='hidden' onChange={handleFilesSelected} />
						</label>

						{files.length > 0 && (
							<div className='w-full'>
								<div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2'>
									<Image src='/file.svg' alt='file' width={36} height={36} className='object-contain w-4 h-4' priority />
									<span>{files.length} files selected</span>
								</div>
								<ul className='space-y-1 max-h-64 overflow-auto'>
									{files.map(file => (
										<li key={file.name} className='text-sm text-gray-600 dark:text-gray-300'>
											{file.name}
										</li>
									))}
								</ul>
							</div>
						)}

						<div className='flex gap-4'>
							<button
								onClick={handleMerge}
								className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								{t('merge')}
							</button>
							<button
								onClick={handleDownload}
								disabled={!mergedContent}
								className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<Download className='w-4 h-4 mr-2' />
								{t('download')}
							</button>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
