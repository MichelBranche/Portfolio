import { useMemo } from 'react'
import { PROJECT_CATEGORY_ORDER, PROJECT_META } from '../../config/site.js'
import { useLanguage } from '../../context/LanguageContext.jsx'

export function useProjects() {
  const { t, lang } = useLanguage()

  return useMemo(() => {
    return PROJECT_META.map((project) => {
      const title = String(t(`projects.${project.slug}.title`))
      const categoryLabel = String(t(`projects.categories.${project.category}`))
      const name = (title.split(' - ')[1] || title).trim()
      return {
        ...project,
        thumb: project.thumbByLang?.[lang] || project.thumb,
        title,
        desc: String(t(`projects.${project.slug}.desc`)),
        categoryLabel,
        kindLabel: String(
          project.client ? t('site.clientWork') : project.product ? t('site.productKind') : t('site.demoConcept'),
        ),
        alt: String(t('projects.coverAlt')).replace('{{name}}', name).replace('{{category}}', categoryLabel.toLowerCase()),
      }
    }).sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
  }, [t, lang])
}

export function groupProjects(projects) {
  const buckets = Object.fromEntries(PROJECT_CATEGORY_ORDER.map((key) => [key, []]))
  for (const project of projects) {
    if (buckets[project.category]) buckets[project.category].push(project)
  }
  return PROJECT_CATEGORY_ORDER.filter((key) => buckets[key].length > 0).map((key) => ({
    key,
    label: buckets[key][0].categoryLabel,
    projects: buckets[key],
  }))
}
