export const runtime = 'edge';

const CANONICAL_BASE = 'https://www.mergemarkdown.com';

const GUIDE_SLUGS = [
	'how-to-merge-markdown-files',
	'merge-markdown-online-vs-command-line',
	'use-cases',
] as const;

const GUIDE_DESCRIPTIONS: Record<
	(typeof GUIDE_SLUGS)[number],
	{ en: string; zh: string }
> = {
	'how-to-merge-markdown-files': {
		en: 'Step-by-step tutorial: upload, reorder, merge, preview and download combined Markdown files.',
		zh: '分步教程：上传、排序、合并、预览并下载合并后的 Markdown 文件。',
	},
	'merge-markdown-online-vs-command-line': {
		en: 'Comparison of online merging vs command-line options (cat, pandoc, Python scripts) and when to use each.',
		zh: '在线合并与命令行方案（cat、pandoc、Python 脚本）的对比，以及各自适用场景。',
	},
	'use-cases': {
		en: 'Real-world scenarios and FAQ: docs sites (MkDocs/GitBook), Obsidian notes, and long-tail Q&A.',
		zh: '真实场景与长尾问答：文档站（MkDocs/GitBook）、Obsidian 笔记整理等。',
	},
};

const GUIDE_TITLES: Record<(typeof GUIDE_SLUGS)[number], { en: string; zh: string }> = {
	'how-to-merge-markdown-files': {
		en: 'How to Merge Markdown Files',
		zh: '如何合并 Markdown 文件',
	},
	'merge-markdown-online-vs-command-line': {
		en: 'Merge Markdown Online vs Command Line',
		zh: '在线合并 Markdown 与命令行方案对比',
	},
	'use-cases': {
		en: 'Markdown Merge Use Cases & FAQ',
		zh: 'Markdown 合并使用场景与常见问题',
	},
};

function guideUrl(locale: string, slug: string): string {
	return locale === 'en'
		? `${CANONICAL_BASE}/guide/${slug}`
		: `${CANONICAL_BASE}/${locale}/guide/${slug}`;
}

function buildLlmsTxt(): string {
	const lines: string[] = [
		'# MergeMarkdown',
		'',
		'> Free online tool to merge multiple Markdown files into one — upload .md files, reorder, preview, and download. No signup, no install; all processing happens in the browser.',
		'>',
		'> 免费在线 Markdown 合并工具——上传多个 .md 文件、排序、预览并下载为一个文件。无需注册、无需安装，所有处理均在浏览器本地完成。',
		'',
		'## Pages',
		'',
		`- [Merge Markdown Files Online – Free MD Merger Tool](${CANONICAL_BASE}/): Free online tool to merge markdown files instantly — no signup, no install required.`,
		`- [在线合并 Markdown 文件 — 免费 MD 合并工具](${CANONICAL_BASE}/zh-CN): 免费在线工具，立即合并多个 Markdown 文件——无需注册或安装。`,
	];

	for (const slug of GUIDE_SLUGS) {
		const title = GUIDE_TITLES[slug];
		const desc = GUIDE_DESCRIPTIONS[slug];
		lines.push(`- [${title.en}](${guideUrl('en', slug)}): ${desc.en}`);
		lines.push(`- [${title.zh}](${guideUrl('zh-CN', slug)}): ${desc.zh}`);
	}

	lines.push(
		'',
		'## Notes',
		'',
		'- All file processing happens locally in the browser; files never leave the device.',
		'- 所有文件处理均在浏览器本地完成，文件不会上传到服务器。',
		`- Sitemap: ${CANONICAL_BASE}/sitemap.xml`,
	);

	return `${lines.join('\n')}\n`;
}

export function GET(): Response {
	return new Response(buildLlmsTxt(), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
