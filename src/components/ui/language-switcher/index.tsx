import { useLocale } from 'next-intl'

import { locales, localeNames } from '@/i18n/i18n'
import { useCustomGetTranslation } from '@/hooks/useCustomGetTranslation'
import { Globe } from 'lucide-react'
import { LocaleSwitcherSelect } from './LocaleSwitcherSelect'
import { cn } from '@/lib/utils'

export default function LocaleSwitcher() {
	const { t } = useCustomGetTranslation('Index')
	const locale = useLocale()

	const options = localeNames.map(item => ({
		value: item.locale,
		label: item.label
	}))

	return (
		<section className='flex items-center gap-1 relative'>
			<Globe className={cn(
				"h-4 w-4",
				"text-foreground"
			)} />
			<LocaleSwitcherSelect defaultValue={locale} label={t('label').trim()} options={options} />
		</section>
	)
}
