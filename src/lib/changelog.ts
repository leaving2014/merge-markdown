// Single-source bilingual changelog. The modal picks `zh` for zh* locales and
// `en` for everything else, so non-Chinese locales fall back to English without
// needing per-locale message keys. Keep entries user-facing only (features and
// fixes ordinary users notice) — skip SEO/AEO/infra work.

export type LocalizedText = { en: string; zh: string }

export type ChangelogSection = {
	heading: LocalizedText
	bullets: LocalizedText[]
}

export type ChangelogRelease = {
	date: string
	sections: ChangelogSection[]
}

export const CHANGELOG: ChangelogRelease[] = [
	{
		date: '2026-10-09',
		sections: [
			{
				heading: {
					en: 'Drag and drop to add files',
					zh: '拖拽添加文件'
				},
				bullets: [
					{
						en: 'Drag .md, .markdown, or .txt files straight onto the page — no more clicking to browse. Drop several at once.',
						zh: '直接把 .md、.markdown、.txt 文件拖到页面上就能添加，不用再点按钮选文件；支持一次拖多个。'
					},
					{
						en: 'Drop whole folders: every Markdown file inside is picked up automatically and sorted in natural filename order (so chapter-2 comes before chapter-10).',
						zh: '支持拖入整个文件夹：自动读取里面所有 Markdown 文件，并按文件名自然顺序排列（第 2 章会排在第 10 章前面）。'
					},
					{
						en: 'The page highlights while you drag, and everything runs in your browser — nothing is uploaded.',
						zh: '拖拽时页面会高亮提示，全程在浏览器本地完成，不上传任何文件。'
					}
				]
			},
			{
				heading: {
					en: 'Dated download filename',
					zh: '下载文件名带日期'
				},
				bullets: [
					{
						en: 'The merged file is now saved as YYYY-MM-DD-merged.md so different batches are easy to tell apart.',
						zh: '合并后的文件现在命名为 YYYY-MM-DD-merged.md，方便区分不同批次的合并结果。'
					}
				]
			}
		]
	}
]
