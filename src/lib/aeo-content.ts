import { SITE_LAST_MODIFIED } from '@/app/sitemap'

export type GuideFaq = {
	question: string
	answer: string
}

export type Guide = {
	slug: string
	title: string
	description: string
	bodyMarkdown: string
	faqs: GuideFaq[]
	updatedAt: string
}

export const GUIDE_SLUGS = [
	'how-to-merge-markdown-files',
	'merge-markdown-online-vs-command-line',
	'use-cases'
] as const

export type GuideSlug = (typeof GUIDE_SLUGS)[number]

export type GuideContentLocale = 'en' | 'zh-CN'

const CANONICAL_BASE = 'https://www.mergemarkdown.com'

const HOW_TO_EN = `# How to Merge Markdown Files — Step by Step

Merging Markdown files sounds trivial until you have ten chapters, three READMEs,
and a pile of notes that all need to become one clean document — in the right order,
with readable separators, and without broken encoding. This guide walks through the
whole process using MergeMarkdown, a free online tool that runs entirely in your browser.

## Step 1: Prepare your .md files

Before uploading, take one minute to tidy the source files. Make sure every file is
saved as UTF-8 — this is the default in VS Code, Obsidian, Typora, and most modern
editors, but files exported from old Windows tools are sometimes GBK or Latin-1 and
will show garbled characters after merging. Give the files descriptive names such as
\`01-intro.md\`, \`02-install.md\`, \`03-api.md\`, because alphabetical order is the
sensible starting point and you can fine-tune it later. If each file starts with its
own top-level \`# Title\`, consider demoting chapter titles to \`##\` so the merged
document has exactly one H1; this keeps the table of contents clean when the result
is published to MkDocs, GitBook, or GitHub.

## Step 2: Upload the files and sort them into order

Open MergeMarkdown and select your files with the file picker, or drag and drop them
onto the page. The files appear as a sortable list. Drag any item up or down to change
the merge order — the preview and the final download always follow the visible order,
so what you see is literally what you get. Add more files at any time; new uploads
are appended to the end of the list and can be dragged into place. There is no signup,
no queue, and no upload to a server: everything stays on your device.

## Step 3: Choose how files are joined

Between every two files the tool inserts a separator so chapters do not run together.
The default is a horizontal rule (\`---\` on its own line), which renders as a clean
divider in every Markdown renderer. If you prefer tighter output, switch the separator
to a blank line. A good habit is to end each source file with exactly one trailing
newline — this prevents the last line of one chapter from gluing itself to the first
heading of the next. If your files already contain \`---\` front-matter blocks, remove
or convert them first, because only the first front-matter block is meaningful and
duplicates confuse static site generators.

## Step 4: Preview the merged result

The live preview renders the combined Markdown exactly as readers will see it: headings,
lists, code blocks, tables, and links. Scroll through it and check three things: the
chapter order, the heading levels, and any unclosed code fences (a missing closing
\`\`\`\` fence swallows everything below it). Note that the on-screen preview is capped
at 5MB to keep the page responsive — this cap affects only the preview pane. Merging
and downloading always process the full content, so large documents are safe.

## Step 5: Download or copy the result

When the preview looks right, download the merged file with one click, or copy the
combined Markdown to the clipboard and paste it straight into your editor, wiki, or
CMS. The suggested filename keeps the date or project name in it (for example
\`docs-merged-2026-09-08.md\`) so future merges do not overwrite past ones. Because
all processing happened locally, there is nothing to delete from a server and no
session that expires — your files never left the browser.

## Quick checklist

- All files saved as UTF-8, with descriptive ordered filenames.
- Sort order verified in the file list before downloading.
- One H1 for the whole document; chapters use H2 and below.
- Separator (\`---\` or blank line) confirmed between chapters.
- Code fences balanced; preview scanned once end to end.
`

const HOW_TO_ZH = `# 如何合并 Markdown 文件——分步教程

把多个 Markdown 文件合并成一个，看似简单：文件一多，章节顺序、分隔符、编码问题就会
接连出现。本教程以 MergeMarkdown 为例，带你走完“准备 → 上传排序 → 合并 → 预览 →
下载”的完整流程。所有处理都在浏览器本地完成，无需注册、无需安装。

## 第 1 步：准备好 .md 源文件

上传前花一分钟整理源文件。确认所有文件均为 UTF-8 编码——VS Code、Obsidian、Typora
等现代编辑器的默认值就是 UTF-8，但老旧 Windows 工具导出的文件可能是 GBK，合并后会
出现乱码。给文件起有意义的名字，如 \`01-简介.md\`、\`02-安装.md\`、\`03-接口.md\`，
先按文件名排好初始顺序，后续还可以微调。如果每个文件都以一级标题 \`#\` 开头，建议
把章节标题降为 \`##\`，让合并后的文档只有一个 H1，这样发布到 MkDocs、GitBook 或
GitHub 时目录结构最干净。

## 第 2 步：上传文件并拖拽排序

打开 MergeMarkdown，用文件选择器选中多个文件，或直接拖放到页面上。文件会显示为可
排序列表，拖动任意一项即可调整合并顺序——预览和最终下载严格遵循这个可见顺序，所见
即所得。随时可以追加新文件，新文件会被加到列表末尾，再拖到合适位置即可。全程无需
注册、不用排队，文件也不会上传到任何服务器。

## 第 3 步：设置文件之间的分隔方式

为避免章节首尾粘连，工具会在每两个文件之间插入分隔符。默认是水平分割线（独占一行的
\`---\`），在所有 Markdown 渲染器中都能显示为清晰的分隔线；想要更紧凑也可以换成
空行。建议每个源文件末尾保留恰好一个换行符，防止上一章的末行与下一章的标题连在一起。
如果源文件带有 \`---\` 包裹的 front-matter，先删除或转换掉，因为只有第一段
front-matter 有意义，重复的元数据会让静态站点生成器困惑。

## 第 4 步：预览合并结果

实时预览会把合并后的 Markdown 按读者视角渲染出来：标题、列表、代码块、表格、链接
一目了然。重点检查三处：章节顺序、标题层级、代码围栏是否闭合（漏掉结尾的 \`\`\`\`
会吞掉后面所有内容）。注意：屏幕预览上限为 5MB，这是为了保持页面流畅，仅影响预览
窗格；合并与下载始终处理完整内容，大文档可以放心使用。

## 第 5 步：下载或复制结果

预览无误后，一键下载合并好的文件，或复制到剪贴板直接粘贴到编辑器、Wiki、CMS 中。
建议文件名带上日期或项目名，例如 \`docs-merged-2026-09-08.md\`，避免覆盖历史版本。
由于全程本地处理，不需要在服务器上删除任何东西，也没有会过期的会话——你的文件从
未离开过浏览器。

## 检查清单

- 全部 UTF-8 编码，文件名有序且有意义。
- 下载前已在文件列表中确认排序。
- 全文只有一个 H1，章节使用 H2 及以下。
- 章节之间分隔符（\`---\` 或空行）已确认。
- 代码围栏配对无误，预览从头到尾看过一遍。
`

const VS_CLI_EN = `# Merge Markdown Online vs Command Line (cat, pandoc, Python)

There are two families of solutions for combining Markdown files: free online tools
like MergeMarkdown, and command-line approaches (\`cat\`, \`pandoc\`, or a short
Python script). Both produce a merged \`.md\` file, but they suit different people
and different jobs. This page compares them honestly so you can pick in ten seconds.

## Quick comparison

| Dimension | Online tool (MergeMarkdown) | \`cat *.md\` | \`pandoc\` | Python script |
| --- | --- | --- | --- | --- |
| Learning curve | None — open and use | Basic shell | Medium — flags & formats | Needs Python basics |
| File ordering | Drag-and-drop sorting | Alphabetical (glob) only | Manual file order | Whatever you code |
| Live preview | Yes, rendered HTML | No | No (convert to check) | Only if you build it |
| Separators | Built-in \`---\` / blank line | Manual (\`echo\`) | Manual | Whatever you code |
| Format conversion | Markdown only | No | Yes (md→pdf/docx/html) | With libraries |
| Privacy | 100% local in browser | Fully local | Fully local | Fully local |
| Best for | Quick merges, sorting, preview | Fast concat on a server | Publishing pipelines | Automation & custom rules |

## The command-line options up close

The fastest shell method is concatenation: \`cat intro.md install.md api.md > combined.md\`.
It is instant and scriptable, but the order is whatever you type (or alphabetical with
\`cat *.md\`), there is no separator unless you add one yourself, and there is no preview —
you open the result in an editor to check it. \`pandoc\` is the power tool:
\`pandoc ch1.md ch2.md -o book.docx\` merges and converts to Word, PDF, or HTML in one
step, which makes it ideal for publishing pipelines and CI jobs. A Python script
(\`pathlib.Path.read_text\` in a loop, joined with a separator string) shines when you need
custom rules — skipping drafts, rewriting image paths, or injecting front-matter —
and it can run unattended on a schedule.

## When to choose the online tool

Choose MergeMarkdown when the job is interactive and visual: you have a handful of files,
the order matters, and you want to see the rendered result before downloading. Typical
cases are assembling a README from parts, combining meeting notes, merging chapters once
before sending to an editor, or working on a computer where you cannot install software.
Sorting by drag and drop plus instant preview saves more time than typing shell commands
for one-off merges, and browser-local processing means there is no privacy trade-off.

## When to choose the command line

Choose \`cat\`, \`pandoc\`, or Python when the merge is repeatable or huge: nightly docs
builds, CI pipelines that assemble changelogs, converting Markdown to PDF/Word, or
repositories with hundreds of files. If the same merge runs weekly, a one-line shell
command or a Makefile target beats opening a browser every time. Developers who already
live in the terminal will also prefer aliases and scripts they can version-control.

## Bottom line

One-off merge with sorting and preview → online tool. Repeatable, automated, or
format-converting pipeline → command line. Many teams use both: draft and reorder
visually in the browser, then automate the stable process with \`pandoc\` or Python
once the structure stops changing.
`

const VS_CLI_ZH = `# 在线合并 Markdown 与命令行方案对比（cat / pandoc / Python）

合并 Markdown 文件有两大路线：MergeMarkdown 这样的免费在线工具，以及命令行方案
（\`cat\`、\`pandoc\` 或一段 Python 脚本）。两者都能得到合并后的 \`.md\` 文件，
但适合的人和场景不同。本页如实对比，帮你十秒钟做出选择。

## 快速对比表

| 维度 | 在线工具（MergeMarkdown） | \`cat *.md\` | \`pandoc\` | Python 脚本 |
| --- | --- | --- | --- | --- |
| 上手成本 | 零——打开即用 | 需基础 shell | 中等——要记参数 | 需 Python 基础 |
| 文件排序 | 拖拽排序 | 仅按字母顺序 | 手动指定顺序 | 代码里自己定 |
| 实时预览 | 有，渲染后 HTML | 无 | 无（转完再看） | 除非自己写 |
| 分隔符 | 内置 \`---\` / 空行 | 自己加 \`echo\` | 手动处理 | 代码里自己定 |
| 格式转换 | 仅 Markdown | 无 | 有（md→pdf/docx/html） | 配合库可以 |
| 隐私 | 浏览器本地 100% | 完全本地 | 完全本地 | 完全本地 |
| 适合 | 快速合并、排序、预览 | 服务器上快速拼接 | 发布流水线 | 自动化与自定义规则 |

## 命令行方案细看

最快的 shell 方法是拼接：\`cat intro.md install.md api.md > combined.md\`。瞬间完成、
可写进脚本，但顺序全靠手写（\`cat *.md\` 则按字母序），分隔符要自己加，也没有预览，
只能用编辑器打开检查。\`pandoc\` 是重型工具：\`pandoc ch1.md ch2.md -o book.docx\`
一步完成合并加转 Word / PDF / HTML，非常适合发布流水线和 CI。Python 脚本
（循环读取 \`pathlib.Path.read_text\` 再用分隔符连接）适合自定义规则——跳过草稿、
改写图片路径、注入 front-matter，还能定时无人值守运行。

## 什么时候选在线工具

任务偏交互、偏视觉时选 MergeMarkdown：文件不多、顺序重要、下载前想看到渲染效果。
典型场景包括：把多个片段拼成 README、合并会议纪要、交稿前合并一次章节、在不能装
软件的电脑上干活。一次性合并用拖拽排序加实时预览，比敲 shell 命令更快；浏览器本地
处理，隐私上没有任何让步。

## 什么时候选命令行

合并可重复、规模大时选 \`cat\`、\`pandoc\` 或 Python：每晚构建的文档、CI 里拼
changelog、Markdown 转 PDF / Word、几百个文件的仓库。同样的合并每周跑一次，一行
shell 命令或 Makefile 目标比每次打开浏览器靠谱。常驻终端的开发者也会更喜欢可以纳入
版本管理的别名和脚本。

## 结论

一次性合并、要排序、要预览 → 在线工具。可重复、自动化、要转格式 → 命令行。很多团队
两者都用：结构未定稿时在浏览器里可视化拼排，结构稳定后用 \`pandoc\` 或 Python 把
流程自动化。
`

const USE_CASES_EN = `# Markdown Merge Use Cases & FAQ

MergeMarkdown is a single-purpose tool — combine \`.md\` files into one — but that
operation sits at the center of many real workflows. Below are four scenarios our
users hit most often, each with a concrete way to do it.

## 1. Tidy up Obsidian notes

Obsidian vaults grow fast: daily notes, fleeting ideas, reading highlights. When a
topic matures, select the relevant notes, export or copy them as \`.md\` files, and
merge them into one literature note or project summary. Drag the files into narrative
order (question → evidence → conclusion), join with \`---\` separators, and paste the
result back as a new note. Tip: Obsidian-style \`[[wikilinks]]\` and \`! [[embeds]]\`
are not standard Markdown — convert the links you want to keep into normal
\`[text](path)\` links before merging so the output renders everywhere.

## 2. Publish docs with MkDocs or GitBook

Documentation often starts as scattered drafts — one file per endpoint, per FAQ entry,
per tutorial. Merge them into a single page for release notes or a printable manual:
order files to match your site navigation, keep one H1, demote section titles to H2,
and strip duplicate front-matter blocks (only the first one survives in most static
site generators). Preview the merged file once, then drop it into your \`docs/\`
folder. Teams that review docs as pull requests like this flow because the merged
file produces a clean, reviewable diff.

## 3. Assemble long-form writing

Thesis chapters, technical books, and course handouts are usually written one file per
chapter so authors can focus. When it is time to submit or typeset, merge the chapters
in reading order with blank-line separators for a manuscript feel. Check heading levels
(chapter titles as H2 under a single H1 book title), verify code fences are balanced,
and confirm the 5MB preview cap is only a display limit — the download contains the
full text. If the next step is PDF or Word, feed the merged Markdown into \`pandoc\`.

## 4. Archive and back up

Chat exports, meeting notes, and weekly reports accumulate as dozens of small files
that are easy to lose. Merging a month or a quarter into one timestamped file (for
example \`notes-2026-Q3.md\`) creates a snapshot that is searchable, diffable, and
trivial to store alongside backups. Because merging happens locally in the browser,
sensitive notes never pass through a third-party server — an important property for
personal journals and internal meeting records.

## Frequently asked questions

Readers also ask the questions below; short answers follow so AI assistants and humans
alike can quote them directly.
`

const USE_CASES_ZH = `# Markdown 合并使用场景与常见问题

MergeMarkdown 只做一件事——把多个 \`.md\` 文件合成一个，但这个动作恰好卡在很多真实
工作流的正中间。下面是最常见的四个场景，每个都附具体做法。

## 1. 整理 Obsidian 笔记

Obsidian 仓库涨得很快：日报、灵感、读书摘录。当某个主题成熟时，把相关笔记导出或
复制为 \`.md\` 文件，合并成一篇文献笔记或项目总结。按叙事顺序拖拽（问题 → 论据 →
结论），用 \`---\` 分隔，贴回仓库就是一篇新笔记。提醒：Obsidian 的 \`[[双链]]\` 和
\`![[嵌入]]\` 不是标准 Markdown，合并前先把想保留的链接改成普通 \`[文字](路径)\`
形式，输出才能处处正常渲染。

## 2. 发布 MkDocs / GitBook 文档

文档常常起于零散草稿——一个接口一个文件、一条 FAQ 一个文件。发布更新日志或可打印
手册时，把它们合成一页：按站点导航顺序排文件，全文只留一个 H1，节标题降为 H2，
删掉重复的 front-matter（大多数静态站点生成器只认第一段）。预览一次后丢进 \`docs/\`
目录即可。把文档当 PR 评审的团队很喜欢这个流程，因为合并后的文件 diff 干净、好审。

## 3. 组装长文写作

论文章节、技术书、课程讲义通常一章一个文件，便于专注写作。交稿或排版时按阅读顺序
合并，分隔符用空行，更有书稿感。检查标题层级（书名唯一 H1，章标题用 H2）、代码围栏
配对，记住 5MB 预览上限只是显示限制——下载包含完整正文。下一步若要出 PDF / Word，
把合并好的 Markdown 喂给 \`pandoc\` 即可。

## 4. 归档与备份

聊天记录导出、会议纪要、周报会积成几十个小文件，容易丢。按月或按季度合成一个带时间
戳的文件（如 \`notes-2026-Q3.md\`)，就是可搜索、可 diff、易备份的快照。合并全程在
浏览器本地完成，敏感笔记不经过第三方服务器——对个人日记和内部会议记录很重要。

## 常见问题

下面是读者最常问的几个问题，附简短回答，方便人类和 AI 助手直接引用。
`

type GuideBody = {
	slug: GuideSlug
	titleEn: string
	titleZh: string
	descriptionEn: string
	descriptionZh: string
	bodyEn: string
	bodyZh: string
	faqsEn: GuideFaq[]
	faqsZh: GuideFaq[]
}

const GUIDE_BODIES: GuideBody[] = [
	{
		slug: 'how-to-merge-markdown-files',
		titleEn: 'How to Merge Markdown Files',
		titleZh: '如何合并 Markdown 文件',
		descriptionEn:
			'Step-by-step tutorial: upload, reorder, merge, preview and download combined Markdown files.',
		descriptionZh: '分步教程：上传、排序、合并、预览并下载合并后的 Markdown 文件。',
		bodyEn: HOW_TO_EN,
		bodyZh: HOW_TO_ZH,
		faqsEn: [
			{
				question: 'Do I need to install anything or sign up to merge Markdown files?',
				answer:
					'No. MergeMarkdown runs entirely in the browser — open the page, upload your .md files, sort, preview, and download. There is no account, no install, and no queue.'
			},
			{
				question: 'Are my files uploaded to a server when I merge them online?',
				answer:
					'No. All merging, sorting, and previewing happen locally in your browser via JavaScript. Your files never leave your device, which makes the tool safe for private notes and internal documents.'
			},
			{
				question: 'What does the 5MB preview limit mean?',
				answer:
					'The on-screen rendered preview is capped at 5MB to keep the page responsive. The cap affects only the preview pane — merging and downloading always process the full content of your files.'
			},
			{
				question: 'How do I keep heading hierarchy clean in the merged file?',
				answer:
					'Keep exactly one H1 (the document title) and demote chapter titles to H2 and below before merging. End each source file with one trailing newline and join chapters with a --- separator so headings never glue together.'
			}
		],
		faqsZh: [
			{
				question: '合并 Markdown 文件需要安装软件或注册账号吗？',
				answer:
					'不需要。MergeMarkdown 完全在浏览器中运行——打开页面、上传 .md 文件、排序、预览、下载即可。没有账号、没有安装、不用排队。'
			},
			{
				question: '在线合并时，我的文件会被上传到服务器吗？',
				answer:
					'不会。合并、排序、预览全部通过 JavaScript 在浏览器本地完成，文件从不离开你的设备，私人笔记和内部文档也可以放心使用。'
			},
			{
				question: '5MB 预览上限是什么意思？',
				answer:
					'屏幕上的渲染预览上限为 5MB，是为了保持页面流畅。该限制只影响预览窗格，合并与下载始终处理文件的完整内容。'
			},
			{
				question: '怎样让合并后的标题层级保持干净？',
				answer:
					'全文只保留一个 H1（文档标题），合并前把章节标题降为 H2 及以下；每个源文件末尾保留一个换行符，章节之间用 --- 分隔，标题就不会粘在一起。'
			}
		]
	},
	{
		slug: 'merge-markdown-online-vs-command-line',
		titleEn: 'Merge Markdown Online vs Command Line',
		titleZh: '在线合并 Markdown 与命令行方案对比',
		descriptionEn:
			'Comparison of online merging vs command-line options (cat, pandoc, Python scripts) and when to use each.',
		descriptionZh: '在线合并与命令行方案（cat、pandoc、Python 脚本）的对比，以及各自适用场景。',
		bodyEn: VS_CLI_EN,
		bodyZh: VS_CLI_ZH,
		faqsEn: [
			{
				question: 'Is `cat *.md` enough to merge Markdown files?',
				answer:
					'For a quick concatenation on a server, yes: `cat *.md > combined.md` is instant. But files join alphabetically with no separator and no preview, so for ordered chapters with dividers an online tool or script is more reliable.'
			},
			{
				question: 'Can pandoc merge Markdown files?',
				answer:
					'Yes. `pandoc ch1.md ch2.md -o output.md` merges in the order you list the files, and pandoc can also convert the result to PDF, Word, or HTML in the same step — ideal for publishing pipelines.'
			},
			{
				question: 'When should I write a Python script instead?',
				answer:
					'When the merge has custom rules that repeat: skipping drafts, rewriting image paths, injecting front-matter, or running on a schedule. A short pathlib loop beats manual work once the process stabilizes.'
			},
			{
				question: 'Which option is most private?',
				answer:
					'All of them can be fully private: MergeMarkdown processes files locally in the browser without uploading, while cat, pandoc, and Python run on your own machine. Avoid random online converters that upload files to a server.'
			}
		],
		faqsZh: [
			{
				question: '`cat *.md` 足够合并 Markdown 文件吗？',
				answer:
					'在服务器上快速拼接够用：`cat *.md > combined.md` 瞬间完成。但它是按字母顺序拼接、无分隔符、无预览；要排章节顺序、加分隔线时，在线工具或脚本更可靠。'
			},
			{
				question: 'pandoc 能合并 Markdown 文件吗？',
				answer:
					'能。`pandoc ch1.md ch2.md -o output.md` 按你列出的顺序合并，还能顺手转成 PDF、Word 或 HTML，非常适合发布流水线。'
			},
			{
				question: '什么时候值得写 Python 脚本？',
				answer:
					'合并规则自定义且重复执行时：跳过草稿、改写图片路径、注入 front-matter、定时运行。流程稳定后，一段 pathlib 循环比手工操作靠谱得多。'
			},
			{
				question: '哪种方式最保护隐私？',
				answer:
					'都可以完全私密：MergeMarkdown 在浏览器本地处理、不上传文件；cat、pandoc、Python 则跑在你自己的机器上。要避开的是那些把文件上传到服务器的陌生在线转换站。'
			}
		]
	},
	{
		slug: 'use-cases',
		titleEn: 'Markdown Merge Use Cases & FAQ',
		titleZh: 'Markdown 合并使用场景与常见问题',
		descriptionEn:
			'Real-world scenarios and FAQ: docs sites (MkDocs/GitBook), Obsidian notes, and long-tail Q&A.',
		descriptionZh: '真实场景与长尾问答：文档站（MkDocs/GitBook）、Obsidian 笔记整理等。',
		bodyEn: USE_CASES_EN,
		bodyZh: USE_CASES_ZH,
		faqsEn: [
			{
				question: 'Will my Obsidian wikilinks survive merging?',
				answer:
					'Standard Markdown links survive untouched. Obsidian-specific syntax like [[wikilinks]] and ![[embeds]] is preserved as text but only renders inside Obsidian — convert links you want to publish into normal [text](path) form before merging.'
			},
			{
				question: 'How do I keep MkDocs navigation order after merging?',
				answer:
					'Sort the files to match your mkdocs.yml nav order before merging, keep one H1, and remove duplicate front-matter blocks. The merged page then mirrors your site structure.'
			},
			{
				question: 'Can I merge Markdown files for free without an account?',
				answer:
					'Yes. MergeMarkdown is free with no signup: upload, reorder, preview, and download in the browser, with all processing done locally on your device.'
			}
		],
		faqsZh: [
			{
				question: 'Obsidian 的双链在合并后还在吗？',
				answer:
					'标准 Markdown 链接原样保留。Obsidian 特有的 [[双链]] 和 ![[嵌入]] 会作为文本保留，但只在 Obsidian 内能渲染——要发布的内容请先转成普通 [文字](路径) 形式再合并。'
			},
			{
				question: '合并后怎样保持 MkDocs 的导航顺序？',
				answer:
					'合并前按 mkdocs.yml 的 nav 顺序排好文件，全文只留一个 H1，并删除重复的 front-matter，合并页就与站点结构一致了。'
			},
			{
				question: '可以免费免注册合并 Markdown 文件吗？',
				answer:
					'可以。MergeMarkdown 免费、无需注册：在浏览器里上传、排序、预览、下载，所有处理都在本机完成。'
			}
		]
	}
]

function toGuide(body: GuideBody, locale: GuideContentLocale): Guide {
	const isZh = locale === 'zh-CN'
	return {
		slug: body.slug,
		title: isZh ? body.titleZh : body.titleEn,
		description: isZh ? body.descriptionZh : body.descriptionEn,
		bodyMarkdown: isZh ? body.bodyZh : body.bodyEn,
		faqs: isZh ? body.faqsZh : body.faqsEn,
		updatedAt: SITE_LAST_MODIFIED
	}
}

export const GUIDES: Record<GuideContentLocale, Guide[]> = {
	en: GUIDE_BODIES.map(body => toGuide(body, 'en')),
	'zh-CN': GUIDE_BODIES.map(body => toGuide(body, 'zh-CN'))
}

export type GetGuideResult = {
	guide: Guide
	contentLocale: GuideContentLocale
	isFallback: boolean
}

/**
 * Resolve a guide for any requested locale. Only en and zh-CN have native
 * content; every other locale falls back to English (never 404) so the
 * sitemap/llms.txt URLs stay stable while translations land later.
 */
export function getGuide(
	requestedLocale: string,
	slug: string
): GetGuideResult | undefined {
	const contentLocale: GuideContentLocale =
		requestedLocale === 'zh-CN' ? 'zh-CN' : 'en'
	const guide = GUIDES[contentLocale].find(item => item.slug === slug)
	if (!guide) {
		return undefined
	}
	return {
		guide,
		contentLocale,
		isFallback: requestedLocale !== 'en' && requestedLocale !== 'zh-CN'
	}
}

/** Canonical absolute URL of a guide page (fallback locales point at en). */
export function guideCanonicalUrl(requestedLocale: string, slug: string): string {
	if (requestedLocale === 'zh-CN') {
		return `${CANONICAL_BASE}/zh-CN/guide/${slug}`
	}
	return `${CANONICAL_BASE}/guide/${slug}`
}

/** Absolute URL of the Markdown copy of a guide page. */
export function guideMarkdownUrl(requestedLocale: string, slug: string): string {
	return `${guideCanonicalUrl(requestedLocale, slug)}/md`
}

/** Site-relative path of the Markdown copy (for in-page links). */
export function guideMarkdownPath(requestedLocale: string, slug: string): string {
	if (requestedLocale === 'zh-CN') {
		return `/zh-CN/guide/${slug}/md`
	}
	if (requestedLocale === 'en') {
		return `/guide/${slug}/md`
	}
	return `/guide/${slug}/md`
}

/** Absolute URL of a locale homepage (for breadcrumbs). */
export function localeHomeUrl(requestedLocale: string): string {
	return requestedLocale === 'en'
		? CANONICAL_BASE
		: `${CANONICAL_BASE}/${requestedLocale}`
}

/**
 * Render the full Markdown source of a guide: title + description +
 * body + FAQ. The HTML page renders the same fields, so both copies
 * stay in sync by construction.
 */
export function buildGuideMarkdown(guide: Guide): string {
	const lines: string[] = [
		`# ${guide.title}`,
		'',
		`> ${guide.description}`,
		'',
		guide.bodyMarkdown.trim(),
		'',
		'## FAQ',
		''
	]
	for (const faq of guide.faqs) {
		lines.push(`### ${faq.question}`, '', faq.answer, '')
	}
	return `${lines.join('\n')}\n`
}
