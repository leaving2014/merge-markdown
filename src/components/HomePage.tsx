'use client'

import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	ChevronDown,
	Code2,
	Copy,
	Download,
	Eye,
	FileText,
	GripVertical,
	Upload,
	X
} from 'lucide-react'
import { marked } from 'marked'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Footer from '@/components/Footer'
import LocaleSwitcher from '@/components/ui/language-switcher'

import { useToast } from '@/hooks/use-toast'

// Configure marked with GFM support
marked.setOptions({
	gfm: true,
	breaks: false
})

type FileItem = {
	id: string
	name: string
	size: number
	lineCount: number
	content: string
}

type PreviewItem = {
	id: string
	name: string
	content: string
}

const PREVIEW_LIMIT = 5 * 1024 * 1024

const formatBytes = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ─── Sortable File Card ───────────────────────────────────────────────────────

type SortableFileCardProps = {
	file: FileItem
	showHandle: boolean
	isDragOverlay?: boolean
	onRemove: (id: string) => void
	onClick: (id: string) => void
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	t: (...args: any[]) => string
}

function SortableFileCard({
	file,
	showHandle,
	isDragOverlay = false,
	onRemove,
	onClick,
	t
}: SortableFileCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id: file.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	return (
		<li
			ref={setNodeRef}
			style={style}
			data-file-id={file.id}
			onClick={() => onClick(file.id)}
			className={`relative cursor-pointer rounded-lg border bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/20 ${
				isDragging
					? 'border-blue-300 opacity-40 shadow-md dark:border-blue-500'
					: isDragOverlay
						? 'border-blue-300 shadow-lg ring-2 ring-blue-300 dark:border-blue-500'
						: 'border-gray-200 shadow-sm dark:border-gray-700'
			}`}
		>
			<div className='flex items-center gap-3'>
				{showHandle && (
					<button
						type='button'
						aria-label={t('moveFile', { name: file.name })}
						onClick={event => event.stopPropagation()}
						className={`flex h-10 w-7 shrink-0 touch-none items-center justify-center rounded text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 ${
							isDragging || isDragOverlay ? 'cursor-grabbing' : 'cursor-grab'
						}`}
						{...attributes}
						{...listeners}
					>
						<GripVertical className='h-4 w-4' />
					</button>
				)}
				<div className='min-w-0 flex-1'>
					<div className='flex min-w-0 items-center gap-2'>
						<FileText className='h-4 w-4 shrink-0 text-gray-400' />
						<p className='truncate text-sm font-medium text-gray-800 dark:text-gray-100'>
							{file.name}
						</p>
					</div>
					<p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
						{formatBytes(file.size)} · {t('lineCount', { count: file.lineCount })}
					</p>
				</div>
				<button
					type='button'
					onClick={event => {
						event.stopPropagation()
						onRemove(file.id)
					}}
					aria-label={t('removeFile', { name: file.name })}
					className='flex h-8 w-8 shrink-0 items-center justify-center rounded text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:hover:bg-red-950/40'
				>
					<X className='h-4 w-4' />
				</button>
			</div>
		</li>
	)
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
	const t = useTranslations('Index')
	const [files, setFiles] = useState<FileItem[]>([])
	const [previewHtmlById, setPreviewHtmlById] = useState<Record<string, string>>({})
	const [previewMode, setPreviewMode] = useState<'rendered' | 'source'>('rendered')
	const [isPreviewOpen, setIsPreviewOpen] = useState(false)
	const [activeDragId, setActiveDragId] = useState<string | null>(null)
	const previewScrollRef = useRef<HTMLDivElement>(null)
	const { toast } = useToast()

	// dnd-kit sensors: pointer (mouse + touch) + keyboard
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				// Require 5px movement to start drag — prevents accidental drags on click
				distance: 5
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	const mergedContent = useMemo(
		() => files.map(file => file.content.trim()).join('\n\n---\n\n'),
		[files]
	)
	const isPreviewTruncated = mergedContent.length > PREVIEW_LIMIT
	const previewItems = useMemo(() => {
		let remaining = PREVIEW_LIMIT
		const items: PreviewItem[] = []

		for (const file of files) {
			if (remaining <= 0) break

			const content = file.content.trim()
			const previewContent = content.slice(0, remaining)
			items.push({
				id: file.id,
				name: file.name,
				content: previewContent
			})
			remaining -= previewContent.length
		}

		return items
	}, [files])

	// Re-render preview HTML whenever the file list or content changes
	useEffect(() => {
		let frameId = 0
		frameId = window.requestAnimationFrame(() => {
			const newHtml: Record<string, string> = {}
			for (const item of previewItems) {
				// marked.parse returns string in synchronous mode (no async option set)
				newHtml[item.id] = String(marked.parse(item.content))
			}
			setPreviewHtmlById(newHtml)
		})
		return () => window.cancelAnimationFrame(frameId)
	}, [previewItems])

	const readFile = (file: File) =>
		new Promise<FileItem>((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = event => {
				const content = String(event.target?.result || '')
				resolve({
					id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
					name: file.name,
					size: file.size,
					lineCount: content ? content.split(/\r\n|\r|\n/).length : 0,
					content
				})
			}
			reader.onerror = reject
			reader.readAsText(file)
		})

	const handleFilesSelected = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFiles = Array.from(event.target.files || [])
			event.target.value = ''
			if (!selectedFiles.length) return

			try {
				const loadedFiles = await Promise.all(selectedFiles.map(readFile))
				setFiles(current => [...current, ...loadedFiles])
				setIsPreviewOpen(true)
			} catch (error) {
				console.error(error)
				toast({
					variant: 'destructive',
					title: t('fileReadError')
				})
			}
		},
		[t, toast]
	)

	const handleRemoveFile = (id: string) => {
		setFiles(current => current.filter(file => file.id !== id))
	}

	const handleClearAll = () => {
		setFiles([])
	}

	const handleSelectFile = (id: string) => {
		setIsPreviewOpen(true)
		window.requestAnimationFrame(() => {
			const target = Array.from(
				previewScrollRef.current?.querySelectorAll<HTMLElement>(
					'[data-preview-file-id]'
				) || []
			).find(element => element.dataset.previewFileId === id)

			target?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		})
	}

	// ── dnd-kit drag handlers ──────────────────────────────────────────────────

	const handleDragStart = (event: DragStartEvent) => {
		setActiveDragId(String(event.active.id))
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		setActiveDragId(null)
		if (!over || active.id === over.id) return
		setFiles(current => {
			const oldIndex = current.findIndex(f => f.id === active.id)
			const newIndex = current.findIndex(f => f.id === over.id)
			return arrayMove(current, oldIndex, newIndex)
		})
	}

	const handleDragCancel = () => {
		setActiveDragId(null)
	}

	// ── Download / Copy ────────────────────────────────────────────────────────

	const handleDownload = () => {
		if (!mergedContent) {
			toast({
				variant: 'destructive',
				title: t('noFilesSelected')
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

	const handleCopy = async () => {
		if (!mergedContent) return
		await navigator.clipboard.writeText(mergedContent)
		toast({
			title: t('copied')
		})
	}

	const activeDragFile = activeDragId
		? files.find(f => f.id === activeDragId)
		: null

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
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

			<main className='mx-auto mb-4 max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8'>
				<div className='mb-6 flex flex-col gap-4 text-center'>
					<h1 className='text-4xl font-bold md:text-6xl'>{t('title')}</h1>
					<p className='mx-auto max-w-2xl px-4 text-base text-gray-600 md:px-0 md:text-xl dark:text-gray-300'>
						{t('description')}
					</p>
				</div>

				<div className='grid gap-4 md:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]'>
					{/* ── Left panel: file list ── */}
					<section className='rounded-lg bg-white p-5 shadow-sm dark:bg-gray-800'>
						<div className='flex flex-col gap-5'>
							<label className='flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'>
								<div className='flex flex-col items-center justify-center px-4 py-6 text-center'>
									<Upload className='mb-3 h-8 w-8 text-gray-400' />
									<p className='text-sm text-gray-500 dark:text-gray-400'>
										{t('selectFiles')}
									</p>
								</div>
								<input
									type='file'
									multiple
									accept='.md,.markdown,text/markdown,text/plain'
									className='hidden'
									onChange={handleFilesSelected}
								/>
							</label>

							<div className='flex items-center justify-between gap-3'>
								<div className='flex min-w-0 items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
									<FileText className='h-4 w-4 shrink-0' />
									<span>
										{files.length
											? t('filesSelected', { count: files.length })
											: t('noFilesSelectedShort')}
									</span>
								</div>
								<div className='flex items-center gap-2'>
									{files.length > 0 && (
										<button
											type='button'
											onClick={handleClearAll}
											className='inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400'
										>
											<X className='h-4 w-4' />
											{t('clearAll')}
										</button>
									)}
									<button
										onClick={handleDownload}
										disabled={!mergedContent}
										className='inline-flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
									>
										<Download className='h-4 w-4' />
										{t('download')}
									</button>
								</div>
							</div>

							{files.length > 0 && (
								<DndContext
									sensors={sensors}
									collisionDetection={closestCenter}
									onDragStart={handleDragStart}
									onDragEnd={handleDragEnd}
									onDragCancel={handleDragCancel}
								>
									<SortableContext
										items={files.map(f => f.id)}
										strategy={verticalListSortingStrategy}
									>
										<ul
											className='max-h-[30rem] space-y-2 overflow-auto pr-1'
											aria-label={t('selectedFilesLabel')}
										>
											{files.map(file => (
												<SortableFileCard
													key={file.id}
													file={file}
													showHandle={files.length > 1}
													onRemove={handleRemoveFile}
													onClick={handleSelectFile}
													t={t}
												/>
											))}
										</ul>
									</SortableContext>

									{/* Drag overlay: renders the floating card while dragging */}
									<DragOverlay>
										{activeDragFile ? (
											<SortableFileCard
												file={activeDragFile}
												showHandle={true}
												isDragOverlay={true}
												onRemove={() => {}}
												onClick={() => {}}
												t={t}
											/>
										) : null}
									</DragOverlay>
								</DndContext>
							)}
						</div>
					</section>

					{/* ── Right panel: preview ── */}
					<section className='rounded-lg bg-white shadow-sm dark:bg-gray-800'>
						<button
							type='button'
							onClick={() => setIsPreviewOpen(current => !current)}
							className='flex w-full items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 text-left md:pointer-events-none dark:border-gray-700'
							aria-expanded={isPreviewOpen}
						>
							<div>
								<h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
									{t('mergedPreview')}
								</h2>
								{isPreviewTruncated && (
									<p className='mt-1 text-xs text-amber-600 dark:text-amber-400'>
										{t('largePreviewNotice')}
									</p>
								)}
							</div>
							<ChevronDown
								className={`h-5 w-5 text-gray-400 transition md:hidden ${isPreviewOpen ? 'rotate-180' : ''}`}
							/>
						</button>

						<div className={`${isPreviewOpen ? 'block' : 'hidden'} md:block`}>
							<div className='flex flex-wrap items-center justify-end gap-2 border-b border-gray-200 px-5 py-3 dark:border-gray-700'>
								<button
									type='button'
									onClick={handleCopy}
									disabled={!mergedContent}
									className='inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
								>
									<Copy className='h-4 w-4' />
									{t('copy')}
								</button>
								<button
									type='button'
									onClick={() =>
										setPreviewMode(current =>
											current === 'rendered' ? 'source' : 'rendered'
										)
									}
									disabled={!mergedContent}
									className='inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
								>
									{previewMode === 'rendered' ? (
										<Code2 className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
									{previewMode === 'rendered' ? t('source') : t('rendered')}
								</button>
							</div>

							<div
								ref={previewScrollRef}
								className='max-h-[42rem] min-h-[28rem] scroll-pt-6 overflow-auto px-5 py-6'
							>
								{mergedContent ? (
									previewMode === 'source' ? (
										<div className='space-y-5'>
											{previewItems.map((item, index) => (
												<section
													key={item.id}
													data-preview-file-id={item.id}
													className='scroll-mt-6'
												>
													<div className='mb-2 truncate text-xs font-medium text-gray-500 dark:text-gray-400'>
														{item.name}
													</div>
													<pre className='whitespace-pre-wrap rounded-md bg-gray-50 p-4 font-mono text-sm leading-6 text-gray-800 dark:bg-gray-900 dark:text-gray-100'>
														<code>{item.content}</code>
													</pre>
													{index < previewItems.length - 1 && (
														<hr className='mt-5 border-gray-200 dark:border-gray-700' />
													)}
												</section>
											))}
										</div>
									) : (
										<div className='space-y-5'>
											{previewItems.map((item, index) => (
												<section
													key={item.id}
													data-preview-file-id={item.id}
													className='scroll-mt-6'
												>
													<div className='mb-3 truncate text-xs font-medium text-gray-500 dark:text-gray-400'>
														{item.name}
													</div>
													{/* marked.js rendered HTML */}
													<div
														className='prose prose-gray max-w-none space-y-4 text-gray-800 dark:text-gray-100 [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm dark:[&_code]:bg-gray-700 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:text-lg [&_h4]:font-semibold [&_hr]:my-6 [&_hr]:border-gray-200 dark:[&_hr]:border-gray-700 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-7 [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-gray-50 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-800 dark:[&_pre]:bg-gray-900 dark:[&_pre_code]:text-gray-100 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_ul]:list-disc [&_ul]:pl-6'
														dangerouslySetInnerHTML={{
															__html: previewHtmlById[item.id] || ''
														}}
													/>
													{index < previewItems.length - 1 && (
														<hr className='mt-5 border-gray-200 dark:border-gray-700' />
													)}
												</section>
											))}
										</div>
									)
								) : (
									<div className='flex min-h-[24rem] items-center justify-center text-center text-sm leading-6 text-gray-400 dark:text-gray-500'>
										{t('previewEmptyLine1')}
										<br />
										{t('previewEmptyLine2')}
									</div>
								)}
							</div>
						</div>
					</section>
				</div>
			</main>
			<Footer />
		</div>
	)
}
