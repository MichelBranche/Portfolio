import { useMemo } from 'react'
import { PROJECT_CATEGORY_ORDER, PROJECT_META } from '../../config/site.js'
import { useLanguage } from '../../context/LanguageContext.jsx'

export function useProjects() {
  const { t } = useLanguage()

  return useMemo(() => {
    return PROJECT_META.map((project) => ({
      ...project,
      title: String(t(`projects.${project.slug}.title`)),
      desc: String(t(`projects.${project.slug}.desc`)),
      categoryLabel: String(t(`projects.categories.${project.category}`)),
    })).sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
  }, [t])
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
