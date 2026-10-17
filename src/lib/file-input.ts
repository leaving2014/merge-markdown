// Browser-only helpers for turning a native drag-and-drop DataTransfer into a
// flat, naturally-sorted list of Markdown files. Supports dropping loose files
// and whole folders (recursive). No uploads happen here — everything stays in
// the browser, matching the site's privacy-first positioning.

const MARKDOWN_EXTENSIONS = ['.md', '.markdown', '.txt'] as const

// Keep in sync with the `<input accept>` in HomePage.
export function isMarkdownFile(name: string): boolean {
	const lower = name.toLowerCase()
	return MARKDOWN_EXTENSIONS.some(ext => lower.endsWith(ext))
}

// Numeric-aware compare so `section-2` sorts before `section-10`.
export function naturalSort(a: string, b: string): number {
	return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

// Minimal structural types for the non-standard, but widely supported,
// FileSystemEntry API exposed via DataTransferItem.webkitGetAsEntry().
type FileSystemEntryLike = {
	isFile: boolean
	isDirectory: boolean
	name: string
	fullPath?: string
}

type FileSystemFileEntryLike = FileSystemEntryLike & {
	file(
		success: (file: File) => void,
		error?: (err: DOMException) => void
	): void
}

type FileSystemDirectoryEntryLike = FileSystemEntryLike & {
	createReader(): FileSystemDirectoryReaderLike
}

type FileSystemDirectoryReaderLike = {
	readEntries(
		success: (entries: FileSystemEntryLike[]) => void,
		error?: (err: DOMException) => void
	): void
}

// A File plus the path used for natural sorting. For loose drops this equals the
// file name; for folder drops it is the relative path (e.g. `docs/2-intro.md`).
export type CollectedFile = {
	file: File
	sortKey: string
}

function readDirectoryEntries(
	reader: FileSystemDirectoryReaderLike
): Promise<FileSystemEntryLike[]> {
	// readEntries returns at most ~100 entries per call; loop until it yields
	// an empty batch to get the full directory contents.
	return new Promise((resolve, reject) => {
		const all: FileSystemEntryLike[] = []
		const readBatch = () => {
			reader.readEntries(entries => {
				if (!entries.length) {
					resolve(all)
					return
				}
				all.push(...entries)
				readBatch()
			}, reject)
		}
		readBatch()
	})
}

function entryToFile(entry: FileSystemFileEntryLike): Promise<File> {
	return new Promise((resolve, reject) => {
		entry.file(resolve, reject)
	})
}

async function walkEntry(
	entry: FileSystemEntryLike,
	prefix: string,
	out: CollectedFile[]
): Promise<void> {
	const path = prefix ? `${prefix}/${entry.name}` : entry.name

	if (entry.isFile) {
		const file = await entryToFile(entry as FileSystemFileEntryLike)
		if (isMarkdownFile(file.name)) {
			out.push({ file, sortKey: path })
		}
		return
	}

	if (entry.isDirectory) {
		const reader = (entry as FileSystemDirectoryEntryLike).createReader()
		const children = await readDirectoryEntries(reader)
		for (const child of children) {
			await walkEntry(child, path, out)
		}
	}
}

function getEntry(item: DataTransferItem): FileSystemEntryLike | null {
	// webkitGetAsEntry must be read synchronously from the item before any
	// await; the DataTransferItem is neutered once the event handler yields.
	const withEntry = item as DataTransferItem & {
		webkitGetAsEntry?: () => FileSystemEntryLike | null
	}
	if (typeof withEntry.webkitGetAsEntry !== 'function') return null
	try {
		return withEntry.webkitGetAsEntry() ?? null
	} catch {
		return null
	}
}

// Collect Markdown files from a drop. Prefers the entry API (handles folders);
// falls back to DataTransfer.files (loose files only) when unavailable.
export async function collectMarkdownFiles(
	dataTransfer: DataTransfer
): Promise<CollectedFile[]> {
	const collected: CollectedFile[] = []

	// Snapshot entries synchronously first — item.kind / webkitGetAsEntry are
	// only valid before the first await in the handler.
	const items = Array.from(dataTransfer.items || [])
	const entries = items
		.filter(item => item.kind === 'file')
		.map(getEntry)
		.filter((entry): entry is FileSystemEntryLike => entry !== null)

	if (entries.length) {
		for (const entry of entries) {
			await walkEntry(entry, '', collected)
		}
	} else {
		// Fallback: browsers without the entry API (or plain file drops).
		for (const file of Array.from(dataTransfer.files || [])) {
			if (isMarkdownFile(file.name)) {
				collected.push({ file, sortKey: file.name })
			}
		}
	}

	collected.sort((a, b) => naturalSort(a.sortKey, b.sortKey))
	return collected
}
