import { motion } from 'framer-motion'

export default function WorksMobile({ 
  t, 
  lang, 
  filteredProjects, 
  filterTag, 
  setFilterTag, 
  allTags, 
  selectedId, 
  setSelectedId, 
  setExpandedProject,
  handleMouseEnter 
}) {
  return (
    <div className="works-mobile-exclusive" style={{ paddingBottom: '3rem', width: '100vw', overflowX: 'hidden' }}>
      <header style={{ marginBottom: '2.5rem', padding: '0 1.25rem' }}>
        <span className="tech-label-xs">{t.works_archive_kicker}</span>
        <h1 className="mobile-wrap-text" style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: 'clamp(2.2rem, 9vw, 3rem)', 
          fontWeight: 900, 
          textTransform: 'uppercase', 
          lineHeight: 0.85, 
          marginTop: '0.4rem'
        }}>
          {t.projects_title.split(' ')[0]}<br/>
          <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>{t.projects_title.split(' ')[1] || 'ARCHIVE'}</span>
        </h1>
      </header>

      {/* 1. MOBILE FILTERS: Scrollable Horizontal Chips */}
      <div 
        className="works-filters-mob" 
        style={{ 
          display: 'flex', 
          gap: '0.65rem', 
          overflowX: 'auto', 
          padding: '0 1.25rem 1.25rem', 
          marginBottom: '1.5rem',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)'
        }}
      >
        <button
          onClick={() => setFilterTag(null)}
          style={{
            flex: '0 0 auto',
            background: filterTag === null ? 'var(--text-primary)' : 'transparent',
            color: filterTag === null ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: '1px solid var(--text-primary)',
            padding: '0.5rem 1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            textTransform: 'uppercase'
          }}
        >
          {t.works_filter_all}
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            style={{
              flex: '0 0 auto',
              background: filterTag === tag ? 'var(--text-primary)' : 'transparent',
              color: filterTag === tag ? 'var(--bg-primary)' : 'var(--text-primary)',
              border: '1px solid var(--text-primary)',
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              textTransform: 'uppercase'
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 2. PROJECT CARDS: Vertical High-Impact List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 1.25rem' }}>
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5 }}
            onClick={() => setExpandedProject(project)}
            style={{ 
              border: '1px solid var(--c-border)', 
              background: 'var(--bg-surface)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span className="tech-label-xs">{String(idx + 1).padStart(2, '0')} // NODE_{project.id}</span>
               <span style={{ fontSize: '1rem', opacity: 0.4 }}>↘</span>
            </div>
            
            <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
              <img 
                 src={project.image} 
                 alt="" 
                 style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
              />
            </div>

            <div style={{ padding: '1.25rem' }}>
               <h3 className="mobile-wrap-text" style={{ 
                 fontFamily: 'var(--font-display)', 
                 fontSize: '1.4rem', 
                 fontWeight: 900, 
                 textTransform: 'uppercase', 
                 lineHeight: 1.1, 
                 marginBottom: '0.5rem'
               }}>
                  {project.title[lang]}
               </h3>
               <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {project.tags.slice(0, 3).map(t => (
                    <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', padding: '0.25rem 0.5rem', border: '1px solid var(--c-border)', opacity: 0.5, textTransform: 'uppercase' }}>
                      {t}
                    </span>
                  ))}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
